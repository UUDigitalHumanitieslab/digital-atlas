import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {

  beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientTestingModule] }));

  it('should be created', () => {
        const service = TestBed.inject(ConfigService);
        expect(service).toBeTruthy();
    });
});
