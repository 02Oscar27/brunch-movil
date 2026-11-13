import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab2Page],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.expectOne('https://dummyjson.com/recipes?limit=30').flush({ recipes: [] });
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => expect(component).toBeTruthy());

  it('filtra los productos por texto', () => {
    component.search = 'pancakes';
    expect(component.filteredProducts.length).toBe(1);
  });
});
