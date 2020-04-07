import ExcelJS from 'exceljs';
import {CardDescriptor} from '../Types';

export function excelToSimplifiedCardData(data: ExcelJS.Buffer, cardSheetId = 'initial_card_set', useColumnHeader = false): Partial<SimplifiedCardData>[] {
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(data);

    const cardSheet = workbook.getWorksheet('initial_card_set');
    
    const columnNumberToId: {[x: number]: keyof SimplifiedCardData} = {
        0: 'id',
        1: 'text'
    };
    
    const cards: Partial<SimplifiedCardData>[] = [];

    cardSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 0 && useColumnHeader) {
            row.eachCell((cell, colNumber) => {
                columnNumberToId[colNumber] = cell.value as keyof SimplifiedCardData;
            });
        } else {
            const card: Partial<SimplifiedCardData> = {};
            row.eachCell({includeEmpty: true}, (cell, colNumber) => {
                const propId = columnNumberToId[colNumber];
                card[propId] = cell as any;
            });
            cards.push(card);
        }
    });
        
    return cards
}


export function importSimplifiedCardData(data: SimplifiedCardData[]): CardDescriptor[] {

    // TODO: verify that we can get the right result from excelSimplifiedCardData()
    // TODO: prepare CardDescriptor[] for editor
    return [];
}

// A row in the excel file, representing a SfF card
type SimplifiedCardData = {
    'id': string,
    'next_left_id': string,
    'next_right_id': string,
    'advisor_id': string,
    'location': string,
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
