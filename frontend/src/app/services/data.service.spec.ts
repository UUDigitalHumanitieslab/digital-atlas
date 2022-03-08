import { TestBed } from '@angular/core/testing';
import { WorkCategory } from '../models/data';

import { DataService } from './data.service';

const locations = [
    {
        name: 'Fort-de-France, Martinique',
        lat: 14.60426,
        long: -61.066971
    },
    {
        name: 'Dominica',
        lat: 15.414999,
        long: -61.370975
    },
    {
        name: 'Colmar, France',
        lat: 48.08062,
        long: 7.35995
    },
    {
        name: 'Paris',
        lat: 48.856613,
        long: 2.352222
    },
    {
        name: 'London',
        lat: 51.507351,
        long: -0.127758
    },
    {
        name: 'Kingston, Jamaica',
        lat: 17.9712148,
        long: -76.7928128
    },
    {
        name: 'Merton College',
        lat: 51.3936101,
        long: -0.2051129
    }
];

describe('DataService', () => {
    let service: DataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should parse dates', () => {
        const values = [
            {
                input: '2022-01-01',
                expected: new Date('2022-01-01'),
            }, {
                input: '',
                expected: undefined
            }
        ];
        values.forEach(item => {
            expect(service.parseDate(item.input)).toEqual(item.expected);
        });

    });

    it('should parse optional strings', () => {
        const values = [
            {
                input: 'test',
                expected: 'test'
            }, {
                input: '',
                expected: undefined
            }
        ];
        values.forEach(item => {
            expect(service.parseOptionalString(item.input)).toEqual(item.expected);
        });
    });

    it('should parse pictures', () => {
        const values = [
            {
                input: 'Frantz Fanon at press conference',
                expected: ['Frantz Fanon at press conference']
            }, {
                input: 'Stuart Hall at desk, Stuart Hall standing',
                expected: ['Stuart Hall at desk', 'Stuart Hall standing']
            }, {
                input: '',
                expected: undefined
            }
        ];
        values.forEach(item => {
            expect(service.parsePictures(item.input)).toEqual(item.expected);
        });
    });

    it('should match locations', () => {
        const values = [
            {
                input: 'Paris',
                expected: locations[3]
            },
            {
                input: 'Parisss',
                expected: undefined
            },
            {
                input: '',
                expected: undefined
            },
        ];
        values.forEach(item => {
            expect(service.findLocation(item.input, locations)).toEqual(item.expected);
        });
    });

    it('should parse authors', () => {
        const input = [
            {
                name: 'Frantz Fanon',
                pictures: 'Frantz Fanon at press conference',
                place_of_birth: 'Fort-de-France, Martinique',
                date_of_birth: '1925-06-20',
                place_of_death: '',
                date_of_death: '',
                description: ''
            }
        ];
        const expected = [
            {
                name: 'Frantz Fanon',
                pictures: ['Frantz Fanon at press conference'],
                placeOfBirth: locations[0],
                dateOfBirth: new Date('1925-06-20'),
                placeOfDeath: undefined,
                dateOfDeath: undefined,
                description: '',
            }
        ];
        expect(service.parseAuthors(input, locations)).toEqual(expected);
    });

    it ('should parse works', () => {
        const input = [
            {
                author_name: 'Frantz Fanon',
                category: 'Publication',
                date: '1948-01-01',
                start_date: '',
                end_date: '',
                pictures: '',
                where: 'Paris',
                title: '',
                description: 'Capécia, Mayotte, 1948, Je suis Martiniquaise, Paris: Corrêa. Translated as I Am a Martinican Woman in I Am a Martinican Woman/The White Negress: Two Novelettes, Beatrice Stith Clark (trans.), Pueblo, CO: Passeggiata Press, 1997.'
            }
        ];
        const expected = [
            {
                author: 'Frantz Fanon',
                category: 'Publication' as WorkCategory,
                date: new Date('1948-01-01'),
                startDate: undefined,
                endDate: undefined,
                pictures: undefined,
                where: locations[3],
                title: '',
                description: 'Capécia, Mayotte, 1948, Je suis Martiniquaise, Paris: Corrêa. Translated as I Am a Martinican Woman in I Am a Martinican Woman/The White Negress: Two Novelettes, Beatrice Stith Clark (trans.), Pueblo, CO: Passeggiata Press, 1997.'
            }
        ];
        expect(service.parseWorks(input, locations)).toEqual(expected);
    });
});
