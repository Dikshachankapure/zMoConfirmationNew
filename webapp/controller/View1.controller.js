sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/viz/ui5/controls/common/feeds/FeedItem',
	'sap/viz/ui5/data/FlattenedDataset',
	'../model/CustomerFormat',
	'../model/InitPage',
	"sap/m/MessageToast"
], function (jQuery, Controller, JSONModel, FeedItem, FlattenedDataset, CustomerFormat, InitPageUtil, MessageToast) {
	"use strict";

	return Controller.extend("MOConfirmation.controller.View1", {
	
		onInit: function (evt) {
			this.initCustomFormat();
			var date = new Date();
			this.byId("dpPeriodFrom").setDateValue(new Date(date.getFullYear(), date.getMonth(), 1));
			this.byId("dpPeriodTo").setDateValue(new Date(date.getFullYear(), date.getMonth() + 1, 0));
			
			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
						visible: true
					},
					dataShape: {
						primaryAxis: ["line", "bar", "bar"]
					}
				},
				valueAxis: {
					label: {
						formatString: CustomerFormat.FIORI_PERCENTAGE_FORMAT_2
					},
					title: {
						visible: true
					}
				},
				categoryAxis: {
					title: {
						visible: true
					}
				},
				title: {
					visible: false
				}
			});
			
			InitPageUtil.initPageSettings(this.getView());
			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(oVizFrame.getVizUid());
			oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
		},
		
		initCustomFormat: function () {
			CustomerFormat.registerCustomFormat();
		},

		onSearch: function () {
			var txtPlant = this.getView().byId("plant1");
			var txtWorkCenter = this.getView().byId("txtWorkCenter");
			var dpPeriodFrom = this.getView().byId("dpPeriodFrom");
			var dpPeriodTo = this.getView().byId("dpPeriodTo");
			if (txtPlant.getValue().trim().length === 0) {
				MessageToast.show("Plz Select Plant");
				return false;
			} else if (txtWorkCenter.getValue().trim().length === 0) {
				MessageToast.show("Plz Select Workcenter");
				return false;
			} else if (dpPeriodFrom.getValue().trim().length === 0) {
				MessageToast.show("Plz Select Posting Date From");
				return false;
			} else if (dpPeriodTo.getValue().trim().length === 0) {
				MessageToast.show("Plz Select Posting Date To");
				return false;
			} else {
				var oModelMOConfirm = this.getOwnerComponent().getModel("MOConfirmDataSet");
				this.getView().setModel(oModelMOConfirm);
			}

		},
		_handleValueHelpWorkcenter: function (oEvent) {

			var oModelWorkcenter = this.getOwnerComponent().getModel("WorkcenterDataSet");
			this.getView().setModel(oModelWorkcenter);

			var sInputValueWorkcenter = oEvent.getSource().getValue();

			this.inputWorkcenterId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogWorkcenter) {
				this._valueHelpDialogWorkcenter = sap.ui.xmlfragment(
					"MOConfirmation.fragments.workcenter", //id.fragments.file.name ---take id from manifest.json
					this
				);
				this.getView().addDependent(this._valueHelpDialogWorkcenter);
			}

			// create a filter for the binding

			this._valueHelpDialogWorkcenter.getBinding("items").filter([new sap.ui.model.Filter(
				"Workcenter",
				sap.ui.model.FilterOperator.Contains, sInputValueWorkcenter
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogWorkcenter.open(sInputValueWorkcenter);
		},
		_handleValueHelpSearchWorkcenter: function (evt) {
			var sValueWorkcenter = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"Workcenter",
				sap.ui.model.FilterOperator.Contains, sValueWorkcenter
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpCloseWorkcenter: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var workcenterInput = this.getView().byId(this.inputWorkcenterId);
				workcenterInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		_handleValueHelpMaterial: function (oEvent) {

			var oModelMaterial = this.getOwnerComponent().getModel("MaterialDataSet");
			this.getView().setModel(oModelMaterial);

			var sInputValueMaterial = oEvent.getSource().getValue();

			this.inputMaterialId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogMaterial) {
				this._valueHelpDialogMaterial = sap.ui.xmlfragment(
					"MOConfirmation.fragments.material", //id.fragments.file.name ---take id from manifest.json
					this
				);
				this.getView().addDependent(this._valueHelpDialogMaterial);
			}

			// create a filter for the binding

			this._valueHelpDialogMaterial.getBinding("items").filter([new sap.ui.model.Filter(
				"Material",
				sap.ui.model.FilterOperator.Contains, sInputValueMaterial
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogMaterial.open(sInputValueMaterial);
		},
		_handleValueHelpSearchMaterial: function (evt) {
			var sValueMaterial = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"Material",
				sap.ui.model.FilterOperator.Contains, sValueMaterial
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpCloseMaterial: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var MaterialInput = this.getView().byId(this.inputMaterialId);
				MaterialInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		_handleValueHelpPlantData: function (oEvent) {

			var oModelPlant = this.getOwnerComponent().getModel("PlantSet");
			this.getView().setModel(oModelPlant);

			var sInputValuePlant = oEvent.getSource().getValue();

			this.inputPlantId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogPlant) {
				this._valueHelpDialogPlant = sap.ui.xmlfragment(
					"MOConfirmation.fragments.plant", //id.fragments.file.name ---take id from manifest.json
					this
				);
				this.getView().addDependent(this._valueHelpDialogPlant);
			}

			// create a filter for the binding

			this._valueHelpDialogPlant.getBinding("items").filter([new sap.ui.model.Filter(
				"PlantName",
				sap.ui.model.FilterOperator.Contains, sInputValuePlant
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogPlant.open(sInputValuePlant);
		},
		_handleValueHelpSearchPlant: function (evt) {
			var sValuePlant = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"PlantName",
				sap.ui.model.FilterOperator.Contains, sValuePlant
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpClosePlant: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var PlantInput = this.getView().byId(this.inputPlantId);
				PlantInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		}

	});
});