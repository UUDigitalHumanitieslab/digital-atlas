import json

def convert_file(in_path, out_path):
    data = parse_input(in_path)

    with open(out_path, 'w') as outfile:
        json.dump(data, outfile)

def parse_input(in_path):
    return {
        'test': {'name': 'test'}
    }