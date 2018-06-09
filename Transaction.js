import React from "react";
import Ribbon from "../components/Ribbon";
import PageHeader from "../components/PageHeader";
import * as transactionService from "../services/transactionService";
import TransactionForm from "../components/TransactionForm";
import Notifier from "../helpers/notifier";

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { transactions: [] };

    this.onAdd = this.onAdd.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    transactionService
      .transactionType()
      .then(data => {
        this.setState({
          transactions: data.items
        });
      })
      .catch(error => Notifier.error("Get Data Error"));
  }

  onAdd() {
    this.setState({
      formData: {}
    });
  }

  onCancel() {
    this.setState({ formData: null });
  }

  onDelete(id) {
    // Modify list to remove deleted item
    this.setState(prevState => {
      const updatedItems = prevState.transactions.filter(item => {
        return item._id !== id;
      });
      // Also set formData to null, to hide form
      return { transactions: updatedItems, formData: null };
    });
  }

  onSave(updatedFormData) {
    this.setState(prevState => {
      const existingItem = prevState.transactions.filter(item => {
        return item._id === updatedFormData._id;
      });
      let updatedItems = [];
      if (existingItem && existingItem.length > 0) {
        updatedItems = prevState.transactions.map(item => {
          return item._id === updatedFormData._id ? updatedFormData : item;
        });
      } else {
        updatedItems = prevState.transactions.concat(updatedFormData);
      }
      return {
        transactions: updatedItems,
        formData: null,
        errorMessage: null
      };
    });
  }

  onSelect(item, event) {
    event.preventDefault();
    this.setState({
      formData: item
    });
  }

  render() {
    const lineItems = this.state.transactions ? (
      this.state.transactions
        .sort((a, b) => {
          const aOrder = parseInt(a.displayOrder, 10);
          const bOrder = parseInt(b.displayOrder, 10);
          if (aOrder < bOrder) {
            return -1;
          }
          if (aOrder > bOrder) {
            return 1;
          }
          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
          }
          if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
          }
          return 0;
        })
        .map(item => {
          return (
            <tr style={{ cursor: "pointer" }} key={item._id}>
              <td onClick={e => this.onSelect(item, e)}>{item.name}</td>
            </tr>
          );
        })
    ) : (
      <div>Loading...</div>
    );

    return (
      <React.Fragment>
        <Ribbon breadcrumbArray={["Transaction Types"]} />
        <PageHeader
          iconClasses="fa fa-lg fa-fw fa-gear"
          title="Transaction Types"
          subtitle="View, Create and Edit"
        />
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div className="panel panel-primary">
                <div className="panel-heading">
                  <i className="fa fa-fw fa-gear" /> View / Edit
                  <button
                    type="button"
                    className="btn btn-warning btn-xs pull-right "
                    onClick={this.onAdd}
                  >
                    Add New
                  </button>
                </div>
                <div className="widget-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover">
                      <tbody>{lineItems}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {this.state.formData && (
              <div className="col-sm-6">
                <TransactionForm
                  formData={this.state.formData}
                  onSave={this.onSave}
                  onDelete={this.onDelete}
                  onCancel={this.onCancel}
                  notify={this.props.notify}
                />
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Transactions;
