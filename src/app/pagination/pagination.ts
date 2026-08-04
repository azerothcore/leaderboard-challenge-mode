import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

const MAX_BUTTONS = 5;

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly total = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly page = input.required<number>();

  readonly pageChange = output<number>();

  protected readonly pageCount = computed(() => Math.max(Math.ceil(this.total() / this.pageSize()), 1));

  protected readonly pages = computed(() => {
    const count = this.pageCount();
    const current = this.page();
    const start = Math.max(1, Math.min(current - Math.floor(MAX_BUTTONS / 2), count - MAX_BUTTONS + 1));
    const end = Math.min(count, start + MAX_BUTTONS - 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });

  protected go(page: number): void {
    if (page >= 1 && page <= this.pageCount() && page !== this.page()) {
      this.pageChange.emit(page);
    }
  }
}
