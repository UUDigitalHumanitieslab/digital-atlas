from datetime import datetime
import json
from openpyxl import load_workbook
from openpyxl.worksheet.worksheet import Worksheet

def convert_file(in_path, out_path):
    data = parse_input(in_path)

    with open(out_path, 'w') as outfile:
        json.dump(data, outfile)

def parse_input(in_path):
    wb = load_workbook(in_path)

    data = {
        sheetname.lower() : parse_sheet(wb[sheetname])
        for sheetname in wb.sheetnames
    }

    return data

def parse_sheet(worksheet: Worksheet):
    header_row = next(worksheet.rows)

    def format_header(header:str):
        lowercase = lambda h : h.lower()
        strip = lambda h: h.strip()
        underscore = lambda h: '_'.join(h.split())
        return underscore(strip(lowercase(header)))

    headers = [format_header(cell.value) for cell in header_row]

    def format_value(value, header):
        if header in ['lat', 'long'] and type(value) == float:
            #floats are used for for lat/long coordinates
            return value
        
        if type(value) == str:
            # remove leading/trailing whitespace for string values
            return value.strip()
        
        if type(value) == datetime:
            return value.strftime('%Y-%m-%d')
        
        if type(value) == int:
            if header in ['date', 'start_date', 'end_date']:
                if header == 'end_date':
                    date = datetime(year = value, month=12, day=31)
                else:
                    date = datetime(year=value, month=1, day=1)
                return date.strftime('%Y-%m-%d')
            else:
                return value
        
        return ''
    
    def format_row(row):
        values = [cell.value for cell in row]
        return {
            header: format_value(value, header) for header, value in zip(headers, values)
        }
    
    data = [format_row(row) for row in list(worksheet.rows)[1:]]

    return data