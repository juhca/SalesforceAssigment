import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPredmeti from '@salesforce/apex/IzpitiController.getPredmeti';
import getIzpitniRoki from '@salesforce/apex/IzpitiController.getIzpitniRokiByPredmet';
import getPrijaveByIzpitniRok from '@salesforce/apex/IzpitiController.getPrijaveByIzpitniRok';
import getStudentInfo from '@salesforce/apex/IzpitiController.getStudentInfo';
import deleteIzpitPrijava from '@salesforce/apex/IzpitiController.deleteIzpitPrijava';

const PRIJAVA_COLUMNS = [
    { label: 'Izpit prijava ID', fieldName: 'Name'},
    { label: 'Ime', fieldName: 'student_ime__c'},
    { label: 'Priimek', fieldName: 'student_priimek__c'},
    { label: 'Izpitni rok ID', fieldName: 'izpitni_rok_ID__c'},
    { label: 'Student ID', fieldName: 'student_id__c'},
    { type: 'button', typeAttributes : {
        label: 'Izbrisi prijavo',
        name: 'Izbrisi prijavo'
    }}
];
 
export default class PrikaziPrijavljeneSt4 extends LightningElement {
        // predmeti variables
    @track predmetiItems = [];
    @track predmetiValue = '';
    @track predmetiChosenValue = '';
        // izpitni roki variables
    @track izpitniRokiItems = [];
    @track izpitniRokiValue = '';
    @track izpitniRokiChosenValue = '';
        // prijave izpit studentov
    @track prijavaItems = [];
    prijavaColumns = PRIJAVA_COLUMNS;
    studentInfo = [];

        // napolni predmeti combobox
    @wire(getPredmeti)
    wiredPredmeti({ error, data }){
        if(data){
            data.forEach(element => {
                this.predmetiItems = [...this.predmetiItems, {value: element.Name, label: element.predmet_ime__c} ];
            });
            this.error = undefined;
        }
        else if(error){
            this.error = error;
            this.contacts = undefined;
        }
    }

    get predmetiOptions(){
        return this.predmetiItems;
    }

    get izpitniRokiOptions(){
        return this.izpitniRokiItems;
    }

    handlePredmetChange(event){
        const selectedOption = event.detail.value;
        this.predmetiChosenValue = selectedOption;
        
        // pocistim shranjene podatke o spremenljivkah
        this.resetCombobox();
        
        // pridobi vse izpite o tem predmetu
        getIzpitniRoki({
            predmetId : this.predmetiChosenValue
        })
        .then(result => {
            
            result.forEach(element => {
                this.izpitniRokiItems = [...this.izpitniRokiItems, { value: element.Name, label: element.datum__c } ];
            });
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.contacts = undefined;
        });       
    }

    handleizpitniRokiChange(event){
        this.studentInfo = [];
        this.prijavaItems = [];

        const selectedOption = event.detail.value;
        this.izpitniRokiChosenValue = selectedOption;

        // pridobi vse prijave na tem izpitnem roku
        getPrijaveByIzpitniRok({
            izpitniRokId : this.izpitniRokiChosenValue
        })
        .then(result => {
            result.forEach(async element => {
                // TODO: boljsi nacin bi bil inner join, to je neoptimalno!
                this.studentInfo = await getStudentInfo({studentId : element.student_id__c});
                this.prijavaItems = [...this.prijavaItems, 
                    { 
                        Name: element.Name, // prijavaIzpitID
                        izpitni_rok_ID__c: element.izpitni_rok_ID__c, 
                        student_id__c: element.student_id__c,
                        student_ime__c: this.studentInfo[0].student_ime__c,
                        student_priimek__c: this.studentInfo[0].student_priimek__c
                    }];
            });
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.contacts = undefined;
        });   
    }

    prijavaAction(event){
        const recordId = event.detail.row.Name;
        const actionName = event.detail.action.name;

        if( actionName === 'Izbrisi prijavo'){
            deleteIzpitPrijava({
                id : recordId
            })
            .then(result => {
                if(result === 'OK'){
                    this.prijavaItems = this.prijavaItems.filter(function (obj) {
                        return obj.Name !== recordId;
                    });
                    
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Record deleted successfully',
                            variant: 'success',
                        }),
                    );
                }
                else{
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error removing record',
                            message: result,
                            variant: 'error',
                        }),
                    );
                }
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error removing record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });   
        }
    }

    get selectedPredmetValue(){
        return this.predmetiChosenValue;
    }

    resetCombobox(){
        this.izpitniRokiItems = [];
        this.izpitniRokiValue = '';
        this.izpitniRokiChosenValue = '';

        this.studentInfo = [];
        this.prijavaItems = [];
    }
}