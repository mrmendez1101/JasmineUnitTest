import { TestBed, inject } from "@angular/core/testing"
import { HeroService } from "./hero.service"
import { HeroSearchComponent } from "./hero-search/hero-search.component";
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

describe('HeroService', () => {
    let mockMessageService;
    let httpTestingController: HttpTestingController;
    let service: HeroService;

    beforeEach(() => {
        mockMessageService = jasmine.createSpyObj(['add'])

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HeroService,
                {
                    provide: MessageService, useValue: mockMessageService
                }]
        });
/*
 *
 */
        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(HeroService);
    });

    describe('getHero', () => {

        it('should call get with the correct URL',
        /**
         * Other way around implementing HttpClient mocks
         * using inject([_Array of dependencies types_ Service, ModuleController],
         *  (_callback func_ func: Func, controller: Controller)) => {}
         *
         *
         */
            /*inject(
                [
                    HeroService,
                    HttpClientTestingModule
                ],
                (
                    service: HeroService,
                    controller: HttpTestingController
                ) => {

                    service.getHero(4).subscribe();
                    expect(true).toBe(true);
                })*/
            () => {
                service.getHero(4).subscribe(/*() => {
                    console.log('fullfileed');
                }*/);

                const request = httpTestingController.expectOne('api/heroes/4');
                request.flush({id: 4, name: 'SuperDude', strength: 100});

                httpTestingController.verify();
            });
    });

});