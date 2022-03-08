import { TestBed } from '@angular/core/testing';
import { Categories, } from '../models/data';

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

const authors = [
    {
        name: 'Frantz Fanon',
        id: 0,
        pictures: ['Frantz Fanon at press conference'],
        placeOfBirth: locations[0],
        dateOfBirth: new Date('1925-06-20'),
        placeOfDeath: undefined,
        dateOfDeath: undefined,
        description: '',
    }, {
        name: 'Stuart Hall',
        id: 1,
        pictures: ['Stuart Hall at desk', 'Stuart Hall standing'],
        placeOfBirth: locations[5],
        dateOfBirth: new Date('1932-02-03'),
        placeOfDeath: locations[4],
        dateOfDeath: new Date('2014-02-10'),
        description: '',
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

    it('should parse picture lists', () => {
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
            expect(service.parseStringList(item.input)).toEqual(item.expected);
        });
    });

    it('should parse work categories', () => {
        const values = [
            {
                input: 'Personal/biography',
                expected: Categories.PersonalBiography
            }, {
                input: 'not listed',
                expected: Categories.Other,
            }
        ];
        values.forEach(item => {
            expect(service.parseCategory(item.input)).toEqual(item.expected);
        });
    });

    it('should match locations', () => {
        const values = [
            {
                input: 'Paris',
                expected: locations[3]
            }, {
                input: 'london ',
                expected: locations[4]
            }, {
                input: 'nonsense',
                expected: undefined
            }, {
                input: '',
                expected: undefined
            },
        ];
        values.forEach(item => {
            expect(service.findLocation(item.input, locations)).toEqual(item.expected);
        });
    });

    it('should match authors', () => {
        const values = [
            {
                input: 'Frantz Fanon',
                expected: authors[0]
            }, {
                input: 'Stuart Hall',
                expected: authors[1]
            }, {
                input: ' stuart hall',
                expected: authors[1],
            }
        ];
        values.forEach(item => {
            expect(service.findAuthor(item.input, authors)).toEqual(item.expected);
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
            }, {
                name: 'Stuart Hall',
                pictures: 'Stuart Hall at desk, Stuart Hall standing',
                place_of_birth: 'Kingston, Jamaica',
                date_of_birth: '1932-02-03',
                place_of_death: 'London',
                date_of_death: '2014-02-10',
                description: ''
            }
        ];
        const expected = authors;
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
                authorId: 0,
                category: Categories.Publication,
                date: new Date('1948-01-01'),
                startDate: undefined,
                endDate: undefined,
                pictures: undefined,
                where: locations[3],
                title: '',
                description: 'Capécia, Mayotte, 1948, Je suis Martiniquaise, Paris: Corrêa. Translated as I Am a Martinican Woman in I Am a Martinican Woman/The White Negress: Two Novelettes, Beatrice Stith Clark (trans.), Pueblo, CO: Passeggiata Press, 1997.'
            }
        ];
        expect(service.parseWorks(input, locations, authors)).toEqual(expected);
    });

    it ('should parse legacies', () => {
        const input = [
            {
                author_names: 'Renate Zahar',
                about: 'Frantz Fanon',
                category: 'Publication',
                date: '1969-01-01',
                start_date: '',
                end_date: '',
                pictures: '',
                where: '',
                title: 'Renate Zahar, Frantz Fanon: Colonialism and Alienation (1969, trans. 1974, Monthly Review Press)',
                description: '',
                url: ''
            },
        ];
        const expected = [
            {
                authorNames: ['Renate Zahar'],
                about: ['Frantz Fanon'],
                aboutIds: [0],
                category: Categories.Publication,
                date: new Date('1969-01-01'),
                startDate: undefined,
                endDate: undefined,
                pictures: undefined,
                where: undefined,
                title: 'Renate Zahar, Frantz Fanon: Colonialism and Alienation (1969, trans. 1974, Monthly Review Press)',
                description: '',
                url: undefined
            }
        ];
        expect(service.parseLegacies(input, locations, authors)).toEqual(expected);
    });

    it ('should parse life events', () => {
        const input = [
            {
                author: 'Frantz Fanon',
                category: 'Personal/biography',
                date: '1942-01-01',
                start_date: '',
                end_date: '',
                pictures: '',
                where: 'Dominica',
                title: 'Resistance',
                description: 'Fled Martinique as a dissident and tried to enlist in the Free French Forces in Dominica'
            }
        ];
        const expected = [
            {
                author: 'Frantz Fanon',
                authorId: 0,
                category: Categories.PersonalBiography,
                date: new Date('1942-01-01'),
                startDate: undefined,
                endDate: undefined,
                pictures: undefined,
                where: locations[1],
                title: 'Resistance',
                description: 'Fled Martinique as a dissident and tried to enlist in the Free French Forces in Dominica'
            }
        ];
        expect(service.parseLifeEvents(input, locations, authors)).toEqual(expected);
    });
});
