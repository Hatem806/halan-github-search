import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortComponent } from './sort.component';
import { provideStore } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { updateSort } from '../../core/state/user/user.actions';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import {
  selectUserQuery,
  selectUserSort,
} from '../../core/state/user/user.selectors';

describe('SortComponent', () => {
  let component: SortComponent;
  let fixture: ComponentFixture<SortComponent>;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    TestBed.configureTestingModule({
      imports: [SelectModule, FormsModule, ButtonModule, SortComponent],
      providers: [provideStore({}), { provide: Store, useValue: spy }],
    });

    fixture = TestBed.createComponent(SortComponent);
    component = fixture.componentInstance;
    storeSpy = TestBed.inject(Store) as jasmine.SpyObj<Store>;

    storeSpy.select.and.callFake((selector: any) => {
      if (selector === selectUserSort)
        return of({ sort: 'followers', order: 'asc' });
      if (selector === selectUserQuery) return of('angular');
      return of(null);
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with store values', () => {
    expect(component.sortKey).toBe('followers');
    expect(component.sortOrder).toBe('asc');
    expect(component.query).toBe('angular');
  });

  it('should dispatch updateSort action when sorting changes', () => {
    const event = { value: 'repositories' };
    component.onSortChange(event);

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      updateSort({
        query: 'angular',
        sort: 'repositories',
        order: 'asc',
      })
    );
  });

  it('should toggle sort order and dispatch updateSort', () => {
    component.toggleOrder();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      updateSort({
        query: 'angular',
        sort: 'followers', // Current sort
        order: 'desc', // Should toggle from asc to desc
      })
    );
  });

  it('should clear sorting and reset to default', () => {
    component.clearSort();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      updateSort({
        query: 'angular',
        sort: '',
        order: 'desc', // Reset to default order
      })
    );
  });

  it('should call onSortChange when selecting a different sort option', () => {
    spyOn(component, 'onSortChange');

    const selectElement = fixture.debugElement.query(
      By.css('p-select')
    ).nativeElement;
    selectElement.value = 'repositories';
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.onSortChange).toHaveBeenCalled();
  });

  it('should call toggleOrder when sort button is clicked', () => {
    spyOn(component, 'toggleOrder');

    const button = fixture.debugElement.query(By.css('p-button')).nativeElement;
    button.click();
    fixture.detectChanges();

    expect(component.toggleOrder).toHaveBeenCalled();
  });
});
