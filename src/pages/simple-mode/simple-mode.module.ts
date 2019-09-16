import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SimpleModePage } from './simple-mode';

@NgModule({
  declarations: [
    SimpleModePage,
  ],
  imports: [
    IonicPageModule.forChild(SimpleModePage),
  ],
})
export class SimpleModePageModule {}
