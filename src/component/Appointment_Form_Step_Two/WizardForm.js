import React, { useState } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import moment from "moment";

import "./styles.css";

const Error = ({ name }) => (
  <Field
    name={name}
    subscribe={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? <span>{error}</span> : null
    }
  />
);

const required = value => (value ? undefined : "Required");

const onSelectStyle = {
  backgroundColor: "#ff6767"
};

const petAge = [
  {
    age: "0 to 1.5"
  },
  {
    age: "1.5 to 6"
  },
  {
    age: "older than 6"
  }
];

const WizardFormBase = props => {
  const [emailError, setEmailError] = useState("");
  const [docID, setdocID] = useState("");
  const [date, setDate] = useState(new Date());
  const [petage, setPetAge] = useState("");
  const [styleID, setStyleID] = useState("");
  const [selectedPet, setPet] = useState("");
  const [selectedPetID, setSelectedPetID] = useState("");

  function dateUpdate(event) {
    setDate(event);
  }

  function petAgeUpdate(event, id) {
    setPetAge(event);
    setStyleID(id);
  }

  // function petAgeUpdate(event) {
  //   console.log(event);
  //   // setPet(event.target.value)
  // }

  function petSelectionChanged(event) {
    setSelectedPetID(event);
  }

  function errorHandler() {
    setEmailError(
      <p>
        Email already exists please <a href={ROUTES.SIGNIN}>signin</a>
      </p>
    );
  }
  return (
    <Styles>
      <h1>Make an appointment with the Vet</h1>
      <h2 />
      <a href="#">Free video consultation on confirmed appointment</a>
      <p style={{ textAlign: "center" }}>
        We can honor the appointment upto one hour after inquiry time.
      </p>
      <Wizard
        initialValues={{ employed: true, stooge: "larry", date: new Date() }}
        firebase={props.firebase}
        date={date}
        petage={petage}
        selectedPet={selectedPet}
        setPet={setPet}
        setPetAge={setPetAge}
        setStyleID={setStyleID}
        setSelectedPetID={setSelectedPetID}
        selectedPetID={selectedPetID}
        emailPrompt={errorHandler}
        setdocID={setdocID}
        setDate={setDate}
        // onSubmit={onSubmit}
      >
        <Wizard.Page
          validate={values => {
            const errors = {};
            if (!values.type) {
              errors.type = "Required";
            }
            if (!values.gender) {
              errors.gender = "Required";
            }
            if (!values.petdate) {
              errors.age = "Required";
            }
            return errors;
          }}
        >
          {selectedPet ? (
            <div>
              <label>Select from old Pets</label>
              <select
                onChange={event => {
                  petSelectionChanged(event.target.value);
                }}
                style={{
                  flex: "1",
                  padding: "3px 5px",
                  fontSize: "1em",
                  marginLeft: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "3px"
                }}
              >
                <option value=""> Choose Old Pet</option>
                {selectedPet &&
                  selectedPet.map(doc => {
                    if (doc.petDoc.petname !== "") {
                      return (
                        <option value={doc.petId}>{doc.petDoc.petname}</option>
                      );
                    }
                  })}
              </select>

              <Error name="session" />
              <button
                onClick={e => {
                  e.preventDefault();
                  petSelectionChanged("reset");
                }}
              >
                Reset and Add new Pet
              </button>
            </div>
          ) : null}

          <div>
            <label>Name of Pet</label>
            <Field
              name="petname"
              component="input"
              type="text"
              date={date}
              placeholder="Tom"
              validate={required}
            />
          </div>
          <div>
            <label>How old is your pet?</label>
            <div className="options-container">
              <ul className="options-list">
                {petAge &&
                  petAge.map((item, id) => {
                    return (
                      <li
                        id={id}
                        style={petage === item.age ? onSelectStyle : null}
                        onClick={() => petAgeUpdate(item.age, id)}
                        className="options-list-item"
                      >
                        <label>
                          <div className="item-container">
                            <p>{item.age}</p>
                          </div>
                        </label>
                      </li>
                    );
                  })}
              </ul>
            </div>
            <Error name="email" />
          </div>
          <div>
            <label>Type</label>
            <Field name="type" component="select">
              <option>Choose Animal</option>
              <option value="dog">Dog</option>
              <option value="cat">🍄 Cat</option>
              <option value="rabbit">🧀 Rabbit</option>
              <option value="bird">🐓 Bird</option>
              <option value="other">🍍 Other</option>
            </Field>
            <Error name="type" />
            <label>Gender</label>
            <Field name="gender" component="select">
              <option>Choose time</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Field>
            <Error name="gender" />
          </div>
          <div>
            <label>
              Tell us more about your pet. Her breed, health issues etc.
            </label>
            <Field
              name="notes"
              type="text"
              placeholder="My dog is a Golden retriever..."
              component="input"
            />
          </div>
        </Wizard.Page>
      </Wizard>
    </Styles>
  );
};
const WizardForm2 = withFirebase(WizardFormBase);

export default WizardForm2;
