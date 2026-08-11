import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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

  // Shapeshifting classes can be recorded as GENDER_NONE (2) because the challenge-modes
  // module snapshots the unit field that shapeshift models overwrite. Only male/female
  // race icons exist, so anything else falls back to male.
  protected readonly iconGender = computed(() => (this.gender() > 1 ? 0 : this.gender()));

  protected readonly getClassName = getClassName;
  protected readonly getRaceName = getRaceName;
}
