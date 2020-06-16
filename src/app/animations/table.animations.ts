import {
  trigger,
  animate,
  transition,
  style,
  keyframes,
} from '@angular/animations';

export const sortTable =
  trigger('sortTable', [
    transition('* => *', [
      animate('300ms ease-in', keyframes([
        style({transform: 'translate3d(0,0,0)', offset: 0}),
        style({transform: 'translate3d(0,-10px,0)', offset: 0.5}),
        style({transform: 'translate3d(0,0,0)', offset: 1})
      ]))
    ])
  ]);
