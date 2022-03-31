from convert.convert import convert_file
import sys
from os import path

arguments = sys.argv

if len(arguments) >= 2:
    in_file = arguments[1]
    if in_file.endswith('.xlsx'):
        if len(arguments) > 2:
            out_file = arguments[2]
        else:
            out_file = path.join(path.dirname(__file__), '..', '..', 'frontend', 'src', 'assets', 'data', 'data.json')
        print('converting', in_file, 'to', out_file, '...')
        convert_file(in_file, out_file)
    else:
        print('Error: input file must be .xlsx format.')
else:
    print('Error: missing input file')