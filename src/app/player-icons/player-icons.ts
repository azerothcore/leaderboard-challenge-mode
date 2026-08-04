import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { getClassName, getRaceName } from '../utils/wow';

@Component({
  selector: 'app-player-icons',
  templateUrl: './player-icons.html',
  styleUrl: './player-icons.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerIconsComponent {
  readonly charClass = input.required<number>();
  readonly race = input.required<number>();
  readonly gender = input.required<number>();
  readonly size = input(32);

  protected readonly getClassName = getClassName;
  protected readonly getRaceName = getRaceName;
}
