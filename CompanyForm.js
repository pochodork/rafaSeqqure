import React from "react";
import { Link } from "react-router-dom";
/* import PageHeader from "../components/PageHeader"; */
import * as companyServices from "../services/company.service";
import FormPanel from "../components/FormPanel";
import Notifier from "../helpers/notifier";

// Helper Functions
import {
  FormField,
  FormFieldConfig,
  validate as formFieldValidate
} from "../helpers/form.helper";

class CompanyForm extends React.Component {
  static emptyForm = {
    name: "",
    legalName: "",
    street: "",
    suite: "",
    city: "",
    state: "",
    zip: "",
    phones: [],
    emails: [],
    licenseAgency: "",
    licenseNumber: "",
    wireInstructionId: "",
    taxIdNumber: ""
  };

  static formDataConfig = {
    name: new FormFieldConfig("Name", {
      required: { value: true, message: "Name is required" },
      maxLength: { value: 50 }
    }),
    legalName: new FormFieldConfig("Legal Name", {
      required: { value: true, message: "Legal Name is required" },
      maxLength: { value: 500 }
    }),
    street: new FormFieldConfig("Street", {
      required: { value: true, message: "Street is required" }
    }),
    suite: new FormFieldConfig("Suite", {
      required: { value: true, message: "Suite is required" }
    }),
    city: new FormFieldConfig("City", {
      required: { value: true, message: "City is required" }
    }),
    state: new FormFieldConfig("State", {
      required: { value: true, message: "State is required" }
    }),
    zip: new FormFieldConfig("Zip", {
      required: { value: true, message: "Zip is required" }
    }),
    phones: new FormFieldConfig("Phones", {
      required: { value: true, message: "Phone is required" }
    }),
    emails: new FormFieldConfig("Emails", {
      required: { value: true, message: "Email is required" }
    }),
    licenseAgency: new FormFieldConfig("License Agency", {
      required: { value: true, message: "License Agency is required" }
    }),
    licenseNumber: new FormFieldConfig("License Number", {
      required: { value: true, message: "License Number is required" },
      maxLength: { value: 50 }
    }),
    wireInstructionId: new FormFieldConfig("Wire Instruction Id", {
      required: { value: true, message: "Wire Instruction Id is required" },
      maxLength: { value: 50 }
    }),
    taxIdNumber: new FormFieldConfig("Tax Id Number", {
      required: { value: true, message: "Tax Id Number is required" }
    })
  };

  constructor(props) {
    super(props);

    const formFields = this.createFormFields(this.props.company);

    this.state = {
      formFields: formFields,
      formValid: this.validateForm(formFields)
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onPhoneAdd = this.onPhoneAdd.bind(this);
    this.onEmailAdd = this.onEmailAdd.bind(this);
    this.onEmailDelete = this.onEmailDelete.bind(this);
    this.onPhoneDelete = this.onPhoneDelete.bind(this);
  }

  validateForm(formFields) {
    return Object.values(formFields).reduce((valid, formField) => {
      return valid && formField.valid;
    }, true);
  }

  createFormFields(data) {
    console.log(data);
    let company = data;

    const formFields = {
      name: new FormField(company.tenantName || ""),
      legalName: new FormField(company.legalName || ""),
      street: new FormField(company.street || ""),
      suite: new FormField(company.suite || ""),
      city: new FormField(company.city || ""),
      state: new FormField(company.state || ""),
      zip: new FormField(company.zip || ""),
      phones: new FormField(company.phones || []),
      emails: new FormField(company.emails || []),
      licenseAgency: new FormField(company.licenseAgency || ""),
      licenseNumber: new FormField(company.licenseNumber || ""),
      wireInstructionId: new FormField(company.wireInstructionId || ""),
      taxIdNumber: new FormField(company.taxIdNumber || "")
    };

    for (let fieldName in formFields) {
      let field = formFields[fieldName];
      let config = CompanyForm.formDataConfig[fieldName];
      formFieldValidate(field, config);
    }
    return formFields;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      formFields: this.createFormFields(nextProps.company)
    });
  }

  onChange(e) {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
    const config = CompanyForm.formDataConfig[name];

    this.setState(prevState => {
      const field = { ...prevState.formFields[name] };
      field.value = value;
      field.touched = true;
      formFieldValidate(field, config);

      const formFields = { ...prevState.formFields, [name]: field };
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }

  onPhoneChange(phone, i, e) {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
    const config = CompanyForm.formDataConfig.phones;

    this.setState(prevState => {
      const field = { ...prevState.formFields.phones };
      const newPhone = {
        ...phone,
        [name]: value
      };
      field.value[i] = newPhone;
      field.touched = true;
      formFieldValidate(field, config);

      const formFields = { ...prevState.formFields, phones: field };
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }

  onPhoneAdd() {
    const phoneTemplate = {
      number: "",
      type: ""
    };
    const config = CompanyForm.formDataConfig.phones;
    this.setState(prevState => {
      const field = { ...prevState.formFields.phones };
      field.value = field.value.concat(phoneTemplate);
      field.touched = true;
      formFieldValidate(field, config);

      const formFields = {
        ...prevState.formFields,
        phones: field
      };
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }

  onEmailAdd() {
    const emailTemplate = {
      email: "",
      type: ""
    };
    const config = CompanyForm.formDataConfig.emails;
    this.setState(prevState => {
      const field = { ...prevState.formFields.emails };
      field.value = field.value.concat(emailTemplate);
      field.touched = true;
      formFieldValidate(field, config);

      const formFields = {
        ...prevState.formFields,
        emails: field
      };
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }

  onEmailDelete(i) {
    const config = CompanyForm.formDataConfig.emails;
    this.setState(prevState => {
      const field = { ...prevState.formFields.emails };
      field.value = field.value.filter((email, index) => index !== i);
      field.touched = true;
      formFieldValidate(field, config);

      const formFields = {
        ...prevState.formFields,
        emails: field
      };
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }

  onPhoneDelete(i) {
    const config = CompanyForm.formDataConfig.phones;
    this.setState(prevState => {
      const field = { ...prevState.formFields.phones };
      field.value = field.value.filter((phone, index) => index !== i);
      field.touched = true;
      formFieldValidate(field, config);

      const formFields = {
        ...prevState.formFields,
        phones: field
      };
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }

  onEmailChange(email, i, e) {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
    const config = CompanyForm.formDataConfig.emails;

    this.setState(prevState => {
      const field = { ...prevState.formFields.emails };
      const newEmail = {
        ...email,
        [name]: value
      };
      field.value[i] = newEmail;
      field.touched = true;
      formFieldValidate(field, config);

      const formFields = { ...prevState.formFields, emails: field };
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.formValid) {
      const formFields = JSON.parse(JSON.stringify(this.state.formFields));
      for (let field in formFields) {
        formFields[field].touched = true;
      }
      this.setState({ formFields: formFields });
      return;
    }

    const company = {
      _id: this.state.activeId,
      name: this.state.formFields.name.value,
      legalName: this.state.formFields.legalName.value,
      street: this.state.formFields.street.value,
      suite: this.state.formFields.suite.value,
      city: this.state.formFields.city.value,
      state: this.state.formFields.state.value,
      zip: this.state.formFields.zip.value,
      phones: this.state.formFields.phones.value,
      emails: this.state.formFields.emails.value,
      licenseAgency: this.state.formFields.licenseAgency.value,
      licenseNumber: this.state.formFields.licenseNumber.value,
      wireInstructionId: this.state.formFields.wireInstructionId.value,
      taxIdNumber: this.state.formFields.taxIdNumber.value
    };

    companyServices
      .update(company)
      .then(response => {
        Notifier.success("Company Updated");
        window.location.href = "/CompanyDashboard/CompanyForm";
        console.log("Update company success");
      })
      .catch(() => {
        console.log("Update company error");
      });
  }

  renderErrorMsgs(field) {
    return !field.valid && field.touched
      ? field.brokenRules.map(br => {
          return (
            <p key={br.rule} className="note note-error">
              {br.msg}
            </p>
          );
        })
      : null;
  }

  render() {
    const inputClassNames = (inputField, baseClassName = "input") => {
      return !inputField.valid && inputField.touched
        ? `${baseClassName} state-error`
        : `${baseClassName}`;
    };

    return (
      <React.Fragment>
        <FormPanel /* title="Company Form" */>
          <form className="smart-form" onSubmit={this.onSubmit}>
            <header>Edit Company</header>
            <fieldset>
              <section>
                <label className="label" htmlFor="name">
                  Name
                </label>
                <label className={inputClassNames(this.state.formFields.name)}>
                  <input
                    type="text"
                    name="name"
                    onChange={this.onChange}
                    value={this.state.formFields.name.value}
                  />
                </label>
                {this.renderErrorMsgs(this.state.formFields.name)}
              </section>
              <section>
                <label className="label" htmlFor="legalName">
                  Legal Name
                </label>
                <label
                  className={inputClassNames(
                    this.state.formFields.legalName,
                    "textarea"
                  )}
                >
                  <textarea
                    name="legalName"
                    onChange={this.onChange}
                    value={this.state.formFields.legalName.value}
                  />
                </label>
                {this.renderErrorMsgs(this.state.formFields.legalName)}
              </section>
            </fieldset>

            <fieldset>
              <div className="row">
                <section className="col col-6">
                  <label className="label" htmlFor="street">
                    Street
                  </label>
                  <label
                    className={inputClassNames(this.state.formFields.street)}
                  >
                    <input
                      type="text"
                      name="street"
                      onChange={this.onChange}
                      value={this.state.formFields.street.value}
                    />
                  </label>
                  {this.renderErrorMsgs(this.state.formFields.street)}
                </section>
                <section className="col col-6">
                  <label className="label" htmlFor="suite">
                    Suite
                  </label>
                  <label
                    className={inputClassNames(this.state.formFields.suite)}
                  >
                    <input
                      type="text"
                      name="suite"
                      onChange={this.onChange}
                      value={this.state.formFields.suite.value}
                    />
                  </label>
                  {this.renderErrorMsgs(this.state.formFields.suite)}
                </section>
              </div>
              <div className="row">
                <section className="col col-6">
                  <label className="label" htmlFor="city">
                    City
                  </label>
                  <label
                    className={inputClassNames(this.state.formFields.city)}
                  >
                    <input
                      type="text"
                      name="city"
                      onChange={this.onChange}
                      value={this.state.formFields.city.value}
                    />
                  </label>
                  {this.renderErrorMsgs(this.state.formFields.city)}
                </section>
                <section className="col col-3">
                  <label className="label" htmlFor="state">
                    State
                  </label>
                  <label
                    className={inputClassNames(this.state.formFields.state)}
                  >
                    <input
                      type="text"
                      name="state"
                      onChange={this.onChange}
                      value={this.state.formFields.state.value}
                    />
                  </label>
                  {this.renderErrorMsgs(this.state.formFields.state)}
                </section>
                <section className="col col-3">
                  <label className="label" htmlFor="zip">
                    Zip
                  </label>
                  <label className={inputClassNames(this.state.formFields.zip)}>
                    <input
                      type="text"
                      name="zip"
                      onChange={this.onChange}
                      value={this.state.formFields.zip.value}
                    />
                  </label>
                  {this.renderErrorMsgs(this.state.formFields.zip)}
                </section>

                <section className="col col-6">
                  <label className="label" htmlFor="phones">
                    Phone
                  </label>
                  {this.state.formFields &&
                    this.state.formFields.phones.value.map((phone, index) => {
                      return (
                        <React.Fragment key={index}>
                          <div className="row mb-2">
                            <section className="col col-3">
                              <label className="select">
                                <select
                                  name="type"
                                  value={phone.type}
                                  onChange={this.onPhoneChange.bind(
                                    this,
                                    phone,
                                    index
                                  )}
                                >
                                  <option value=""> Type </option>
                                  <option value="Main">Main</option>
                                  <option value="Cell">Cell</option>
                                  <option value="Other">Other</option>
                                </select>
                                <i />
                              </label>
                            </section>

                            <section className="col col-9">
                              <button
                                type="button"
                                className="btn btn-sm btn-danger pull-right"
                                onClick={this.onPhoneDelete.bind(this, index)}
                              >
                                Delete
                              </button>
                            </section>
                          </div>
                          <section>
                            <label className="input">
                              <input
                                type="text"
                                name="number"
                                placeholder="phone number"
                                onChange={this.onPhoneChange.bind(
                                  this,
                                  phone,
                                  index
                                )}
                                value={phone.number}
                              />
                            </label>
                          </section>
                        </React.Fragment>
                      );
                    })}

                  {this.renderErrorMsgs(this.state.formFields.phones)}

                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={this.onPhoneAdd}
                  >
                    Add Phone
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    onClick={this.onSubmit}
                  >
                    Save
                  </button>
                </section>

                <section className="col col-6">
                  <label className="label" htmlFor="emails">
                    Email
                  </label>
                  {this.state.formFields.emails.value.map((email, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div className="row mb-2">
                          <section className="col col-3">
                            <label className="select">
                              <select
                                name="type"
                                value={email.type}
                                onChange={this.onEmailChange.bind(
                                  this,
                                  email,
                                  index
                                )}
                              >
                                <option value=""> Type </option>
                                <option value="Main">Main</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                              </select>
                              <i />
                            </label>
                          </section>

                          <section className="col col-9">
                            <button
                              type="button"
                              className="btn btn-sm btn-danger pull-right"
                              onClick={this.onEmailDelete.bind(this, index)}
                            >
                              Delete
                            </button>
                          </section>
                        </div>
                        <section>
                          <label className="input">
                            <input
                              type="text"
                              name="email"
                              placeholder="email address"
                              onChange={this.onEmailChange.bind(
                                this,
                                email,
                                index
                              )}
                              value={email.email}
                            />
                          </label>
                        </section>
                      </React.Fragment>
                    );
                  })}

                  {this.renderErrorMsgs(this.state.formFields.emails)}

                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={this.onEmailAdd}
                  >
                    Add Email
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    onClick={this.onSubmit}
                  >
                    Save
                  </button>
                </section>
              </div>
            </fieldset>
            <fieldset>
              <div className="row">
                <section className="col col-6">
                  <label className="label" htmlFor="licenseAgency">
                    License Agency
                  </label>
                  <label
                    className={inputClassNames(
                      this.state.formFields.licenseAgency
                    )}
                  >
                    <input
                      type="text"
                      name="licenseAgency"
                      onChange={this.onChange}
                      value={this.state.formFields.licenseAgency.value}
                    />
                  </label>
                  {this.renderErrorMsgs(this.state.formFields.licenseAgency)}
                </section>
              </div>
              <div className="row">
                <section className="col col-6">
                  <label className="label" htmlFor="licenseNumber">
                    License Number
                  </label>
                  <label
                    className={inputClassNames(
                      this.state.formFields.licenseNumber
                    )}
                  >
                    <input
                      type="text"
                      name="licenseNumber"
                      onChange={this.onChange}
                      value={this.state.formFields.licenseNumber.value}
                    />
                  </label>
                  {this.renderErrorMsgs(this.state.formFields.licenseNumber)}
                </section>
              </div>
              <div className="row">
                <section className="col col-6">
                  <label className="label" htmlFor="wireInstructionId">
                    Wire Instruction Id
                  </label>
                  <label
                    className={inputClassNames(
                      this.state.formFields.wireInstructionId
                    )}
                  >
                    <input
                      type="text"
                      name="wireInstructionId"
                      onChange={this.onChange}
                      value={this.state.formFields.wireInstructionId.value}
                    />
                  </label>
                  {this.renderErrorMsgs(
                    this.state.formFields.wireInstructionId
                  )}
                </section>
              </div>
              <div className="row">
                <section className="col col-6">
                  <label className="label" htmlFor="taxIdNumber">
                    Tax Id Number
                  </label>
                  <label
                    className={inputClassNames(
                      this.state.formFields.taxIdNumber
                    )}
                  >
                    <input
                      type="text"
                      name="taxIdNumber"
                      onChange={this.onChange}
                      value={this.state.formFields.taxIdNumber.value}
                    />
                  </label>
                  {this.renderErrorMsgs(this.state.formFields.taxIdNumber)}
                </section>
              </div>
            </fieldset>
            <footer>
              <button
                type="submit"
                className="btn btn-sm btn-primary"
                onClick={this.onSubmit}
              >
                Save
              </button>

              <Link
                role="button"
                className="btn btn-sm btn-warning"
                to={{
                  pathname: "/company",
                  state: { company: this.state.company }
                }}
              >
                Cancel
              </Link>
            </footer>
          </form>
        </FormPanel>
      </React.Fragment>
    );
  }
}
export default CompanyForm;
