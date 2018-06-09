import React from "react";
import { Route, NavLink } from "react-router-dom";

import FormPanel from "../components/FormPanel";
import CompanyForm from "../containers/CompanyForm";
import * as companyServices from "../services/company.service";
// import { getPersonById } from "../services/people.service";
import CompanyPeopleInvite from "../containers/CompanyPeopleInvite";
// import CompanyRead from "./companyRead";
import WireInstructionsIndex from "./WireInstructionsIndex";
import Ribbon from "../components/Ribbon";
import PageHeader from "../components/PageHeader";

class CompanyDashBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      companyData: null
    };
  }

  componentDidMount() {
    companyServices
      .readAll()
      .then(response => {
        this.setState({
          companyData: response.items[0]
        });
      })
      .catch(() => {
        console.log("readAll error");
      });
  }

  render() {
    return (
      <React.Fragment>
        <Ribbon breadcrumbArray={["Admin", "Company", "Company Dashboard"]} />
        <PageHeader iconClasses="fa fa-lg fa-fw fa-gear" title="Company" />
        <FormPanel title="Company Dashboard">
          <div>
            <br />
            <hr className="simple" />
            <ul className="nav nav-tabs bordered">
              <li>
                <NavLink
                  activeClassName="active"
                  to={`${this.props.match.url}/CompanyForm`}
                >
                  Edit Company{" "}
                </NavLink>
              </li>
              <li>
                <NavLink
                  activeClassName="active"
                  to={`${this.props.match.url}/WireInstructionsIndex`}
                >
                  Wire Instructions{" "}
                </NavLink>
              </li>
              <li>
                <NavLink
                  activeClassName="active"
                  to={`${this.props.match.url}/CompanyPeopleInvite`}
                >
                  People{" "}
                </NavLink>
              </li>

              <li />
            </ul>
            <div className="tab-content padding-10">
              <div className="tab-pane fade in active">
                <Route
                  path={`${this.props.match.path}/CompanyForm`}
                  render={props =>
                    this.state.companyData ? (
                      <CompanyForm
                        {...props}
                        company={this.state.companyData}
                      />
                    ) : (
                      <div> Loading...</div>
                    )
                  }
                />
                <Route
                  path={`${this.props.match.path}/wireInstructionsIndex`}
                  render={props => (
                    <WireInstructionsIndex
                      {...props}
                      data={this.state.companyData}
                      name={this.state.companyData.tenantName}
                    />
                  )}
                />
                <Route
                  path={`${this.props.match.path}/CompanyPeopleInvite`}
                  render={props => <CompanyPeopleInvite {...props} />}
                />
              </div>
            </div>
          </div>
        </FormPanel>
      </React.Fragment>
    );
  }
}

export default CompanyDashBoard;
