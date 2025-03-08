import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortComponent } from './sort.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  selectUserQuery,
  selectUserSort,
} from '../../core/state/user/user.selectors';
import { updateSort } from '../../core/state/user/user.actions';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('SortComponent', () => {
  let component: SortComponent;
  let fixture: ComponentFixture<SortComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  // Mock state values
  const initialSort = { sort: 'joined', order: 'desc' };
  const initialQuery = '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SortComponent);
    component = fixture.componentInstance;

    // Spy on dispatch
    dispatchSpy = spyOn(store, 'dispatch');

    // Mock store selectors
    store.overrideSelector(selectUserSort, initialSort);
    store.overrideSelector(selectUserQuery, initialQuery);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct observable values', () => {
    expect(component.sortKey).toBe('joined');
    expect(component.sortOrder).toBe('desc');
    expect(component.query).toBe('');
  });

  it('should dispatch updateSort when onSortChange is triggered', () => {
    const mockEvent = { value: 'repositories' };
    component.onSortChange(mockEvent);

    expect(component.sortKey).toBe('repositories');
    expect(dispatchSpy).toHaveBeenCalledWith(
      updateSort({ query: '', sort: 'repositories', order: 'desc' })
    );
  });

  it('should toggle order and dispatch updateSort', () => {
    component.toggleOrder();

    expect(component.sortOrder).toBe('asc'); // Initially 'desc', should toggle
    expect(dispatchSpy).toHaveBeenCalledWith(
      updateSort({ query: '', sort: 'joined', order: 'asc' })
    );

    // Toggle again
    component.toggleOrder();
    expect(component.sortOrder).toBe('desc');
    expect(dispatchSpy).toHaveBeenCalledWith(
      updateSort({ query: '', sort: 'joined', order: 'desc' })
    );
  });

  it('should clear sorting and dispatch updateSort', () => {
    component.clearSort();

    expect(component.sortKey).toBe(''); // Cleared sorting
    expect(component.sortOrder).toBe('desc'); // Should reset to default
    expect(dispatchSpy).toHaveBeenCalledWith(
      updateSort({ query: '', sort: '', order: 'desc' })
    );
  });

  it('should update sortKey when sort is changed', () => {
    expect(component.sortKey).toBe('joined'); // Initial value from mock store

    component.onSortChange({ value: 'repositories' });
    fixture.detectChanges();

    expect(component.sortKey).toBe('repositories'); // Verify sortKey changes
  });

  it('should dispatch updateSort when clear button is clicked', () => {
    let clearButton: DebugElement = fixture.debugElement.query(By.css('.ms-2'));

    clearButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateSort({ query: '', sort: '', order: 'desc' })
    );
  });
});
