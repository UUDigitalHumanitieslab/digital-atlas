import { TestBed } from '@angular/core/testing';
import { WorkCategory } from '../models/data';

import { DataService } from './data.service';

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
                placeOfBirth: 'Fort-de-France, Martinique',
                dateOfBirth: new Date('1925-06-20'),
                placeOfDeath: undefined,
                dateOfDeath: undefined,
                description: '',
            }
        ];
        expect(service.parseAuthors(input)).toEqual(expected);
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
                where: 'Paris',
                title: '',
                description: 'Capécia, Mayotte, 1948, Je suis Martiniquaise, Paris: Corrêa. Translated as I Am a Martinican Woman in I Am a Martinican Woman/The White Negress: Two Novelettes, Beatrice Stith Clark (trans.), Pueblo, CO: Passeggiata Press, 1997.'
            }
        ];
        expect(service.parseWorks(input)).toEqual(expected);
    });
});
