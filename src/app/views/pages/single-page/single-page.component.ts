import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-page',
  templateUrl: './single-page.component.html',
  
})
export class SinglePageComponent implements OnInit {
  fileToUpload: any = null;
  imageUrl: any = "https://image.freepik.com/free-vector/white-blurred-background_1034-249.jpg";
  videoUrl:any = null;
  items: any;
  modalImg = document.getElementById("img01");
  
  constructor( private http: HttpClient) { }
  handleImageInput(event: any){
    this.videoUrl = null;
    this.imageUrl = this.handlefileInput(event,1);
  }
  handleVideoInput(event: any){
    this.imageUrl = null;
    this.videoUrl = this.handlefileInput(event,2);
  }
  handlefileInput(event: any, type:number) {
    this.fileToUpload = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        //this.videoUrl = null;
        if(type==1){
          this.imageUrl = event.target?.result;
        }
        else{
          this.videoUrl = event.target?.result;
        }
        console.log(event.target);
      }
    } 
  }
  onUpload(){
    const fd = new FormData();
    if(this.imageUrl){
      fd.append('image', this.fileToUpload, this.fileToUpload.name);
    }
    else if(this.videoUrl){
      fd.append('video', this.fileToUpload, this.fileToUpload.name);
    }
    else{
      alert("Upload media first");
      return;
    }

    //-----------------UPLOAD---------------
    this.http.post('',fd,{
      reportProgress: true,
      observe:"events"
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress){
        console.log(event.loaded);
      }
      else if(event.type === HttpEventType.Response){
        console.log(event);
      }
      
    })
  }
  onPreview(){
    if(this.imageUrl){
      var newWindow = window.open(`${this.imageUrl}`);
      //console.log(this.url);
    }
    else if(this.videoUrl){
      var newWindow = window.open(`${this.videoUrl}`);
    }
    else{
      alert("Upload media first");
    }
  }
  
  ngOnInit(): void {
  }
   

}
