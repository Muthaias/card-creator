import ExcelJS from 'exceljs';
import {CardDescriptor, CardType, ModifierType} from '../Types';

export async function excelToSimplifiedCardData(data: ExcelJS.Buffer, cardSheetId = 'initial_card_set', useColumnHeader = true): Promise<Partial<SimplifiedCardData>[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(data);

    const cardSheet = workbook.worksheets.find(ws => ws.name === cardSheetId);
    
    const columnNumberToId: {[x: number]: keyof SimplifiedCardData} = {
        0: 'id',
        1: 'text'
    };
    
    const cards: Partial<SimplifiedCardData>[] = [];

    if (cardSheet) {
        cardSheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1 && useColumnHeader) {
                row.eachCell((cell, colNumber) => {
                    columnNumberToId[colNumber] = cell.value as keyof SimplifiedCardData;
                });
            } else {
                const card: Partial<SimplifiedCardData> = {};
                row.eachCell({includeEmpty: true}, (cell, colNumber) => {
                    const propId = columnNumberToId[colNumber];
                    card[propId] = cell.value as any;
                });
                cards.push(card);
            }
        });
    }
        
    return cards
}

export function importSimplifiedCardData(data: SimplifiedCardData[]): CardDescriptor[] {
    const cards: CardDescriptor[] = data.map<CardDescriptor>(({ id, next_left_id, next_right_id, location, name, text, left, right, environment_left, environment_right, people_left, people_right, security_left, security_right, money_left, money_right, popularity_left, popularity_right, }, index) => ({
        id: id || ('excelcard_' + index + '_' +  Date.now()),
        name: name,
        text,
        type: next_left_id || next_right_id ? CardType.Event : CardType.Action,
        location,
        weight: 1,
        conditions: [],
        actions: [
            {
                actionId: 'left',
                description: left,
                modifierType: 'add' as ModifierType,
                values: {
                    environment: environment_left,
                    people: people_left,
                    security: security_left,
                    money: money_left,
                    popularity: popularity_left
                },
                flags: {},
                nextCardId: next_left_id
            }, {
                actionId: 'right',
                description: right,
                modifierType: 'add' as ModifierType,
                values: {
                    environment: environment_right,
                    people: people_right,
                    security: security_right,
                    money: money_right,
                    popularity: popularity_right
                },
                flags: {},
                nextCardId: next_right_id,
            }
        ],
    }));

    return cards;
}

export const DefaultSimplifiedCardData: SimplifiedCardData = {
    'id': 'default',
    'next_left_id': '',
    'next_right_id': '',
    'advisor_id': '',
    'location': '',
    'name': 'Default card name',
    'text': '',
    'left': '',
    'right': '',
    'environment_left': 0,
    'people_left': 0,
    'security_left': 0,
    'money_left': 0,
    'popularity_left': 0,
    'environment_right': 0,
    'people_right': 0,
    'security_right': 0,
    'money_right': 0,
    'popularity_right': 0,
};

// A row in the excel file, representing a SfF card
type SimplifiedCardData = {
    'id': string,
    'next_left_id': string,
    'next_right_id': string,
    'advisor_id': string,
    'location': string,
    'name': string,
    'text': string,
    'left': string,
    'right': string,
    'environment_left': number,
    'people_left': number,
    'security_left': number,
    'money_left': number,
    'popularity_left': number,
    'environment_right': number,
    'people_right': number,
    'security_right': number,
    'money_right': number,
    'popularity_right': number,
}
