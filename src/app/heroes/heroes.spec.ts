
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { NO_ERRORS_SCHEMA, Component, Input, DebugElement } from "@angular/core";
import { HeroService } from "../hero.service";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";
import { conditionallyCreateMapObjectLiteral } from "@angular/compiler/src/render3/view/util";

describe('HeroesComponent', () => {
    let component: HeroesComponent;
    let HEROES;
    let mockHeroService;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'Matt', strength: 8 },
            { id: 2, name: 'John', strength: 35 },
            { id: 3, name: 'Doe', strength: 12 }
        ];

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero', 'lalamove']);

        component = new HeroesComponent(mockHeroService);

    });

    describe('delete', () => {
        it('should delete current selected hero', () => {
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = HEROES;

            component.deleteHero(HEROES[2]);

            expect(component.heroes.length).toBe(2);
        });

        it('should call lalamove method', () => {
            mockHeroService.lalamove('a');
            expect(mockHeroService.lalamove).toHaveBeenCalled();
        });

        // interaction test
        it('should call deleteHero', () => {
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = HEROES;

            component.deleteHero(HEROES[2]);

            expect(mockHeroService.deleteHero).toHaveBeenCalled();
            expect(component.heroes.length).toEqual(2);
            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
        });
    });

    describe('add', () => {
        it('should add new hero', () => {
            let hero = { id: 4, name: 'Dummy asdas', strength: 11 };
            mockHeroService.addHero.and.returnValue(of(hero))
            component.heroes = HEROES;

            component.add(hero.name);
            expect(mockHeroService.addHero).toHaveBeenCalledWith({ name: 'Dummy asdas', strength: 11 });
            expect(component.heroes.length).toBeGreaterThan(3);
        })
    });

    describe('get', () => {
        it('should return hero dummy list', () => {
            mockHeroService.getHeroes.and.returnValue(of(HEROES));

            component.getHeroes();

            expect(component.heroes.length).toBe(3);
            expect(component.heroes.length).toBeGreaterThan(0);
        });
    });
});


describe('HeroesComponent (shallow tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    @Component({
        selector: 'app-hero',
        template: '<div></div>',
    })

    class FakeHeroComponent {
        @Input() hero: Hero;
        // @Output() delete = new EventEmitter();
    }

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 24 },
            { id: 3, name: 'SuperDude', strength: 55 }
        ]
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                FakeHeroComponent
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            // schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should set heroes correctly from the service', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        expect(fixture.componentInstance.heroes.length).toBe(3);
    });

    it('should create one li for each hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
    });

    xit('should remove last element', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        mockHeroService.deleteHero(HEROES[2]);

        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(0);
    })
})


describe('HeroComponent (Deep Test)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;
    let el: DebugElement;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 24 },
            { id: 3, name: 'SuperDude', strength: 55 }
        ]
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroesComponent);
        el = fixture.debugElement;

    });

    it('should render each hero as a HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        //run ngOnInit
        fixture.detectChanges();

        //fixture.debugElement
        const heroesComponentDEs = el.queryAll(By.directive(HeroComponent));
        expect(heroesComponentDEs.length).toEqual(3);
        expect(heroesComponentDEs[0].componentInstance.hero.name).toEqual('SpiderDude');

        let i = 0;
        heroesComponentDEs.forEach(e => {
            expect(e.componentInstance.hero).toEqual(HEROES[i]);
            i++;
        });
    });

    it(`should call heroService.deleteHero when the 
        Hero Component's delete button is clicked`, () => {
            mockHeroService.getHeroes.and.returnValue(of(HEROES));
            spyOn(fixture.componentInstance, 'deleteHero');

            fixture.detectChanges();

            const heroComponents = el.queryAll(By.directive(HeroComponent));
            // heroComponents[0].query(By.css('button'))
            //     .triggerEventHandler('click', {stopPropagation: () => {}});

            (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);

            expect(fixture.componentInstance.deleteHero).toHaveBeenCalledWith(HEROES[0]);

    });




})
