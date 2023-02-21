import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import  STUDENT_OBJECT  from '@salesforce/schema/student__c';
import  STUDENT_IME from '@salesforce/schema/student__c.student_ime__c';
import  STUDENT_PRIIMEK  from '@salesforce/schema/student__c.student_priimek__c';
import  STUDENT_DATUMROJSTVA  from '@salesforce/schema/student__c.datum_rojstva__c';
import  STUDENT_EMAIL  from '@salesforce/schema/student__c.email__c';
import  STUDENT_EMSO from '@salesforce/schema/student__c.emso__c';
import  STUDENT_VRSTASTUDIJA  from '@salesforce/schema/student__c.vrsta_studija__c';
import  STUDENT_NASLOV  from '@salesforce/schema/student__c.naslov__c';
import  STUDENT_PLACNIK  from '@salesforce/schema/student__c.Placnik__c';
import  STUDENT_TELEFON  from '@salesforce/schema/student__c.telefon__c';

export default class VnosStudenta extends LightningElement {
    Student = STUDENT_OBJECT;
    StudentFields = [STUDENT_IME, STUDENT_PRIIMEK, STUDENT_DATUMROJSTVA, STUDENT_EMAIL, STUDENT_EMSO, STUDENT_NASLOV, STUDENT_TELEFON];
    studentPlacnik = STUDENT_PLACNIK;
    studentVrstaStudija = STUDENT_VRSTASTUDIJA;
    visiblePlacnik = false;
    
    successHandler(event){
        const toastEvent = new ShowToastEvent({
            title: "Student created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
        this.resetValues();
    }

    errorHandler(event){
        const toastEvent = new ShowToastEvent({
            title: "Student created",
            message: "Message: " + event.detail.message,
            variant: "error"
        });
        this.dispatchEvent(toastEvent);
    }

    showPlacnik(){
        let pickListValue = this.template.querySelector("[data-id='VrstaStudijaPickList']").value;
        this.visiblePlacnik = pickListValue === 'Izredni studij' ? true : false;
    }

    resetValues(){
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if(inputFields){
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}