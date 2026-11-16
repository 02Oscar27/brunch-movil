import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab2Page],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // La petición se lanza en el constructor; la API responde sin recetas,
    // así que la página usa el menú local de respaldo.
    httpMock.expectOne('https://dummyjson.com/recipes?limit=30').flush({ recipes: [] });
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => expect(component).toBeTruthy());

  it('usa el menú local cuando la API no devuelve recetas', () => {
    expect(component.usingLocalMenu()).toBe(true);
    expect(component.products().length).toBeGreaterThan(0);
  });

  it('filtra los productos por texto', () => {
    component.search.set('pancakes');
    expect(component.filteredProducts().length).toBe(1);
  });

  it('filtra los productos por categoría', () => {
    component.selectedCategory.set('Saludables');
    expect(component.filteredProducts().every((p) => p.categoria === 'Saludables')).toBe(true);
  });
});
