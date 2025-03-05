import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { provideStore } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Store } from '@ngrx/store';
import { loadUsers } from '../../core/state/user/user.actions';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, InputTextModule, FloatLabel, SearchComponent],
      providers: [
        provideStore({}), // Provide a mock NgRx store
        { provide: Store, useValue: spy }, // Mock Store with spy
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    storeSpy = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update searchTerm when input changes', () => {
    const inputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;

    inputElement.value = 'angular';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.searchTerm).toBe('angular');
  });

  it('should call onSearchInputChange when input value changes', () => {
    spyOn(component, 'onSearchInputChange');

    const inputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    inputElement.value = 'rxjs';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.onSearchInputChange).toHaveBeenCalledWith('rxjs');
  });

  it('should debounce input and dispatch loadUsers action when search term is valid', fakeAsync(() => {
    component.onSearchInputChange('react');
    tick(500); // Simulates debounceTime(500)
    fixture.detectChanges();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      loadUsers({ query: 'react', page: 1, perPage: 10 })
    );
  }));

  it('should NOT dispatch loadUsers action when search term is empty', fakeAsync(() => {
    component.onSearchInputChange('');
    tick(500);
    fixture.detectChanges();

    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  }));

  it('should debounce multiple rapid inputs and only dispatch once', fakeAsync(() => {
    component.onSearchInputChange('angular');
    tick(250); // First partial debounce
    component.onSearchInputChange('angularjs');
    tick(250); // Resets debounce timer
    component.onSearchInputChange('angular');
    tick(500); // Full debounce period
    fixture.detectChanges();

    expect(storeSpy.dispatch).toHaveBeenCalledTimes(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      loadUsers({ query: 'angular', page: 1, perPage: 10 })
    );
  }));
});
