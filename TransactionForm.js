import React from "react";
import deepmerge from "deepmerge";
import PropTypes from "prop-types";
import * as transactionService from "../services/transactionService";
import {
  FormField,
  FormFieldConfig,
  validate as formFieldValidate
} from "../helpers/form.helper";
import FormPanel from "./FormPanel";
import Notifier from "../helpers/notifier";

class TransactionForm extends React.Component {
  static propTypes = {
    formData: PropTypes.shape({
      name: PropTypes.string,
      _id: PropTypes.string,
      displayOrder: PropTypes.any,
      isObsolete: PropTypes.bool
    }),
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onDelete: PropTypes.func
  };

  static defaultProps = {
    formData: {
      _id: "",
      name: "",
      displayOrder: 0,
      isObsolete: false
    }
  };
  // formDataConfig specifies validation rules and
  // friendly display name for each form field

  static formDataConfig = {
    _id: new FormFieldConfig("_Id"),
    name: new FormFieldConfig("Name", {
      required: { value: true, message: "Name is required" },
      maxLength: { value: 50 }
    }),

    displayOrder: new FormFieldConfig("DisplayOrder", {
      required: { value: true },
      maxLength: { value: 50 }
    }),
    isObsolete: new FormFieldConfig("Obsolete")
  };

  constructor(props) {
    super(props);
    const formFields = this.convertPropsToFormFields(props);

    this.state = {
      formFields: formFields,
      formValid: this.validateForm(formFields)
    };

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  // Returns true if every field is valid
  validateForm(formFields) {
    return Object.values(formFields).reduce((valid, formField) => {
      return valid && formField.valid;
    }, true);
  }

  // maps model values to full-up FormFields
  convertPropsToFormFields(props) {
    // Make sure any undefined props are defined, to prevent react
    // warning about uncontrolled inputs.
    // https://davidwalsh.name/javascript-deep-merge
    let transaction = deepmerge(
      TransactionForm.defaultProps.formData,
      props.formData
    );

    const formFields = {
      _id: new FormField(transaction._id),
      name: new FormField(transaction.name),
      displayOrder: new FormField(transaction.displayOrder),
      isObsolete: new FormField(transaction.isObsolete)
    };

    // Loop through validation for each field
    for (let fieldName in formFields) {
      let field = formFields[fieldName];
      let config = TransactionForm.formDataConfig[fieldName];
      formFieldValidate(field, config);
    }

    return formFields;
  }

  // If parent component changes prop values during the
  // lifetime of this component, update state accordingly
  componentWillReceiveProps(nextProps) {
    const formFields = this.convertPropsToFormFields(nextProps);
    this.setState({
      formFields: formFields,
      formValid: this.validateForm(formFields)
    });
  }

  onChange(event) {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const name = event.target.name;
    const config = TransactionForm.formDataConfig[name];

    this.setState(prevState => {
      const field = { ...prevState.formFields[name] };
      field.value = value;
      field.touched = true;
      formFieldValidate(field, config);
      const formFields = { ...prevState.formFields, [name]: field }; //?
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }

  onSave(event) {
    if (!this.state.formValid) {
      const formFields = JSON.parse(JSON.stringify(this.state.formFields));
      for (let fieldIdentifier in formFields) {
        formFields[fieldIdentifier].touched = true;
      }
      this.setState({ formData: formFields });
      return;
    }
    const item = {
      _id: this.state.formFields._id.value,
      name: this.state.formFields.name.value,
      displayOrder: this.state.formFields.displayOrder.value,
      isObsolete: this.state.formFields.isObsolete.value
    };

    if (this.state.formFields._id.value) {
      transactionService
        .update(item)
        .then(data => {
          Notifier.success("Saved changes");
          this.props.onSave(item);
        })
        .catch(error => Notifier.error("Save Changes Failed: "));
    } else {
      delete item._id;
      transactionService
        .create(item)
        .then(data => {
          Notifier.success("Saved New Transaction");

          this.setState(prevState => {
            const field = { ...prevState.formFields._id, _id: data.id };
            const formFields = { ...prevState.formFields, _id: field };
            return { ...prevState, formFields: formFields };
          });
          this.props.onSave({ ...item, _id: data.id });
        })
        .catch(error => Notifier.error("Saved new Transaction Type failed"));
    }
  }

  onCancel(event) {
    this.props.onCancel();
  }

  onDelete(event) {
    transactionService
      .del(this.state.formFields._id.value)
      .then(() => {
        // If delete worked, parent control will hide form
        this.props.onDelete(this.state.formFields._id.value);
      })
      .catch(err => {
        Notifier.error("Delete failed: ");
      });
  }

  renderErrorMsgs(field) {
    return !field.valid && field.touched
      ? field.brokenRules.map(br => {
          return (
            <div key={br.rule} className="note note-error">
              {br.msg}
            </div>
          );
        })
      : null;
  }

  inputClassName(field) {
    return !field.valid && field.touched ? "input state-error" : "input";
  }

  render() {
    const title = (
      <span>
        <i className="fa fa-fw fa-gear" /> Create / Edit
      </span>
    );

    return (
      <FormPanel title={title}>
        <form className="smart-form">
          <fieldset>
            <section>
              <label htmlFor="name">
                {TransactionForm.formDataConfig.name.displayName}
              </label>
              <label
                className={this.inputClassName(this.state.formFields.name)}
              >
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  value={this.state.formFields.name.value}
                  onChange={this.onChange}
                />
              </label>
              {this.renderErrorMsgs(this.state.formFields.name)}
            </section>
            <section>
              <label
                className={this.inputClassName(
                  this.state.formFields.displayOrder
                )}
                htmlFor="displayOrder"
              >
                Display Order
              </label>
              <label className="input">
                <input
                  type="text"
                  name="displayOrder"
                  id="displayOrder"
                  className="form-control"
                  value={this.state.formFields.displayOrder.value}
                  onChange={this.onChange}
                />
              </label>
              {this.renderErrorMsgs(this.state.formFields.displayOrder)}
            </section>
            <section>
              {/* <label className="label">Other</label> */}
              <div className="checkbox-inline">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="isObsolete"
                    checked={this.state.formFields.isObsolete.value}
                    value={true}
                    onChange={this.onChange}
                  />
                  <i /> Obsolete
                </label>
              </div>
            </section>
          </fieldset>

          <div className="btn-group pull-right" role="group">
            <button
              type="button"
              onClick={this.onSave}
              className="btn btn-primary btn-sm"
              /* disabled={!this.state.formValid} */
            >
              {this.state.formFields._id.value ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={this.onCancel}
              className="btn btn-warning btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => this.onDelete(this.state.formFields)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </form>
      </FormPanel>
    );
  }
}

export default TransactionForm;
