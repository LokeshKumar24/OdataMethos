sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
	    "sap/m/MessageBox"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller,JSONModel,MessageBox) {
		"use strict";

		return Controller.extend("ODM.ODataMethods.controller.View1", {
			onInit: function () {
                this.oDataGet();
            },
            oDataModel : new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZLKBATCH_SRV/"),

            oDateUpdate:function(payLoad){
                debugger;
               var that=this;
                var empID = payLoad.Employeeid;
                this.oDataModel.update("/EMPLOYEESet('" + empID + "')",payLoad,{
                    method:"PUT",
                    success:function(odata){
                        if (odata !== "" || odata !== undefined) {
                                            MessageBox.success("Updated successfully.");
                                            that.oDataGet();
                                        } else {
                                            MessageBox.error("Not updated.");
                                        }

                                        },
                    error:function(){

                    }
                });

            },

            oDateCreate:function(obj){
                var that=this;
				var payLoad={
		Employeeid:obj.Employeeid,
		 Employeename:obj.Employeename,
		 Employeedesignation:obj.Employeedesignation
        };
                this.oDataModel.create("/EMPLOYEESet",payLoad,{
                     success:function(odata){
                    if (odata !== "" || odata !== undefined) {
                                        MessageBox.success("Created successfully.");
                                        that.oDataGet();
                                    } else {
                                        MessageBox.error("New entry not created.");
                                    }
                    },
                    error:function(){
                        
                    }
                });
            },

            oDataDelete:function(oEvent){
                debugger
                var empID = oEvent.getSource().oParent.sId
    empID = empID[empID.length-1]
    empID = Number(empID) ;
                var that=this;
                this.oDataModel.remove("/EMPLOYEESet('" + empID + "')",{
                     success:function(odata){
                        if (odata !== "" || odata !== undefined) {
                                                MessageBox.success("Deleted successfully.");
                                                that.oDataGet();
                                            } else {
                                                MessageBox.error("Not able to delete.");
                                            }

				
                    },
                    error:function(){
                        
                    }
                });
            },
            oDataGet:function(){
                var that=this;
               this.oDataModel.read("/EMPLOYEESet",{
                    success:function(oData){
                             var alldata={
			EmployeeSet:oData.results
		};
		
		            var Model= new JSONModel(alldata);
                        that.getOwnerComponent().setModel(Model,"odata");
                    },
                    error:function(){
                        
                    }
               });
            },

            oDataFunctionImport:function(designation){
                // designationArray.forEach(element=>{

                // });
             //   var designation=designationArray.join(",");
            var that=this;
             var oDataModel=this.getOwnerComponent().getModel();
             
                oDataModel.callFunction("/EMPBYDESIGNATION",{
                     method:"GET",
                     urlParameters:{
                       DESIGNATION:  designation
                     },
                    
                      success:function(oData){
                          console.log(oData.results);
                        var table=   that.getView().byId("mTable");
                        table.setModel(new JSONModel({EmployeeSet:oData.results}),"odata")
                          //  MessageBox.success("Success");
                    },
                    error:function(){
                         MessageBox.error("error");
                    }
                    });
                    },

                    oPopUp: null,
		popUp: function () {
			if (!this.oPopUp) {
				var oid = this.createId("empFrag");
				this.oPopUp = new sap.ui.xmlfragment(oid, "ODM.ODataMethods.view.employee", this);
				this.getView().addDependent(this.oPopUp);
			}
			this.oPopUp.open();
        },
        
		onClose: function () {
			this.oPopUp.close();
        },

        itemData: [],
		onSubmit: function () {
			var id = this.getView().getModel("empModel").getProperty("/id");
			var name = this.getView().getModel("empModel").getProperty("/empName");
			var designation = this.getView().getModel("empModel").getProperty("/empDesignation");
		
			var items = {
				Employeeid: id,
				Employeename: name,
				Employeedesignation:designation
			};
		
		if(this.update===null){
			this.oDateCreate(items);
		}
		else if(this.update==="update"){
			this.oDateUpdate(items);
			this.update=null;
		}
			 this.getView().getModel("empModel").setProperty("/id","");
			 this.getView().getModel("empModel").setProperty("/empName","");
			 this.getView().getModel("empModel").setProperty("/empDesignation","");
			this.onClose();
        },
        
        update:null,
		onEdit:function(oEvent){
             var empID = oEvent.getSource().oParent.sId
    empID = empID[empID.length-1]
    empID = Number(empID) ;
    empID = this.getOwnerComponent().getModel("odata").getProperty("/EmployeeSet/" + empID)
    
			
		var payLoad={
		Id:empID.Employeeid,
		 Name:empID.Employeename,
		 Designation:empID.Employeedesignation
		};
			 this.getView().getModel("empModel").setProperty("/id",payLoad.Id);
			 this.getView().getModel("empModel").setProperty("/empName",payLoad.Name);
			 this.getView().getModel("empModel").setProperty("/empDesignation",payLoad.Designation);
			 this.update="update";
			 this.popUp();
        },

         updateTable:function(){
              //  debugger
                var aToken=this.getView().byId("multiInput1").getValue()
                //.getTokens();

                var sData = aToken;
                //aToken.map( function(token){return token.getText()}).join(",");
              // debugger
                //   var arr= [],
                //   arr=sData.split(",");
                  if (sData!=="" && sData!==null) {
                      
                      this.oDataFunctionImport(sData);
                  } else {
                      MessageBox.warning("Enter designation only");
                       this.oDataGet();
                  }
           
           
            }
		});
	});
