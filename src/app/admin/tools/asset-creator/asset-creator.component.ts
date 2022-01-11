import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RequestService } from 'src/services/http/request.service';

@Component({
  selector: 'app-asset-creator',
  templateUrl: './asset-creator.component.html',
  styleUrls: ['./asset-creator.component.scss']
})
export class AssetCreatorComponent implements OnInit {

  @ViewChild('nameInput', { static: false }) nameInput!: ElementRef;
  @ViewChild('descriptionInput', { static: false }) descriptionInput!: ElementRef;
  @ViewChild('tagInput', { static: false }) tagInput!: ElementRef;
  @ViewChild('serialInput', { static: false }) serialInput!: ElementRef;
  @ViewChild('manufacturerInput', { static: false }) manufacturerInput!: ElementRef;
  @ViewChild('modelInput', { static: false }) modelInput!: ElementRef;
  @ViewChild('notesInput', { static: false }) notesInput!: ElementRef;

  constructor(
    private request: RequestService
  ) { }

  loading: boolean = false;

  ngOnInit(): void {
  }

  async submit(): Promise<void> {
    try {
      this.loading = true;
      let errs = false;
      const data = {
        name: this.nameInput.nativeElement.value,
        description: this.descriptionInput.nativeElement.value,
        identifier: this.tagInput.nativeElement.value,
        category: 1,
        image_url: 'https://content.hillview.tv/images/assets/g20.jpeg',
        serial_number: this.serialInput.nativeElement.value,
        manufacturer: this.manufacturerInput.nativeElement.value,
        model: this.modelInput.nativeElement.value,
        notes: this.notesInput.nativeElement.value
      }
      Object.values(data).forEach((value, index) => {
        if (!value) {
          window.alert(`Missing ${Object.keys(data)[index]}`);
          errs = true;
        }
      })
      if (errs) {
        this.loading = false;
        return;
      }

      const response = await this.request.post(`${environment.ASSET_API_URL}/create/asset`, data)
      if (response.status === 201) {
        window.alert('Asset created successfully');
        window.location.reload();
      }
      
    } catch (error) {
      console.error(error);
    }
  }

}
