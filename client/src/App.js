import React, { Component } from "react";
import axios from "axios";

import Select from "./components/select";

// const Api = "http://localhost:8011";

const Api = "https://damp-hamlet-34407.herokuapp.com"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      first_person: "",
      relation: "",
      second_person: "",
      selectedPerson1: "",
      selectedPerson2: "",
      degreesOfConnection: [],
      noConnection: false,
    };
  }

  handleChange = ({ target: input }) => {
    const data = { ...this.state };
    data[input.name] = input.value;

    this.setState(data);
  };

  getPersonsData = async () => {
    const result = await axios.get(`${Api}/persons`);
    const data = { ...this.state };
    data.persons = result.data;
    this.setState(data);
  };

  componentDidMount() {
    this.getPersonsData();
  }

  handleSubmit = async () => {
    const { first_person, relation, second_person } = this.state;
    const payload = {
      first_person,
      relation,
      second_person,
    };
    await axios.post(`${Api}/addrelationship`, payload);
    this.setState({
      first_person: "",
      relation: "",
      second_person: "",
    });
    alert("Successfully added");
    this.getPersonsData();
  };

  handleSelect = ({ target: input }) => {
    const data = { ...this.state };
    data[input.name] = input.value;
    data.degreesOfConnection = [];
    data.noConnection = false;
    this.setState(data);
  };

  handleGet = async () => {
    const { selectedPerson1, selectedPerson2 } = this.state;
    const result = await axios.get(`${Api}/getdegreesofconnections`, {
      params: { first_person: selectedPerson1, second_person: selectedPerson2 },
    });
    console.log(result.data);
    if (result.data != "") {
      console.log("no");
      this.setState({ noConnection: false, degreesOfConnection: result.data });
    } else {
      console.log("yes");
      this.setState({ noConnection: true, degreesOfConnection: result.data });
    }
  };

  render() {
    const {
      persons,
      first_person,
      relation,
      second_person,
      degreesOfConnection,
      noConnection,
    } = this.state;

    return (
      <div className="container">
        <div>
          <h1>Realtionship App</h1>
          <h4>Add realationship</h4>
          <form>
            <input
              type="text"
              name="first_person"
              value={first_person}
              placeholder="First Person..."
              onChange={this.handleChange}
            />

            <span> is a </span>
            <input
              type="text"
              name="relation"
              value={relation}
              placeholder="Relation Tag..."
              onChange={this.handleChange}
            />

            <span> of </span>
            <input
              type="text"
              name="second_person"
              value={second_person}
              placeholder="Second Person..."
              onChange={this.handleChange}
            />

            <button type="button" onClick={this.handleSubmit}>
              Add/Edit
            </button>
          </form>

          <hr />
        </div>

        <div>
          <h4>Get degrees of connection...</h4>
          <form>
            <Select
              name="selectedPerson1"
              options={persons}
              onChange={this.handleSelect}
            />
            <span> and </span>
            <Select
              name="selectedPerson2"
              options={persons}
              onChange={this.handleSelect}
            />
            <button type="button" onClick={this.handleGet}>
              Get
            </button>
          </form>
          <div className="result">
            {degreesOfConnection !== "" &&
              degreesOfConnection.map((name, idx) => (
                <span key={idx}>{`${name} ${
                  idx !== degreesOfConnection.length - 1 ? "->" : ""
                } `}</span>
              ))}
            {noConnection && <span>No Connection</span>}
          </div>
          <hr />
        </div>
      </div>
    );
  }
}

export default App;


