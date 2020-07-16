import React, {useState} from 'react';
import Styles from './Styles'
import { Form, Field } from 'react-final-form';

import './App.css';


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


const required = value => (value ? undefined : 'Required');
const mustBeNumber = value => (isNaN(value) ? 'Must be a number' : undefined);
const minValue = min => value =>
    isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`;
const composeValidators = (...validators) => value =>
    validators.reduce((error, validator) => error || validator(value), undefined);

function App() {

    //handling errors
    const [error, setError] = useState(null);
    const [color, setColor] = useState('');


    const onSubmit = async (values) => {
        await sleep(300);
        const paperData = (JSON.stringify(values, 0, 2));


        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/papers/`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: paperData
            });
            const responseData = await response.json();


            if(!response.ok)
            {

                setError(responseData.message);
                setColor('danger');
            } else
            {
                setError('Recorded Successfully!');
                setColor('success');
            }

        } catch(err)
        {
            setError(err.message);
            setColor('danger');
        }


        // window.alert("Your Data was Saved\n"+JSON.stringify(values, 0, 2));
    };

    return (
        <Styles>
            <h1>Collecting Paper Data</h1>
            <h2>Fill this form carefully</h2>
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit} >
                        <Field name="title" validate={required}>
                            {({ input, meta }) => (
                                <div>
                                    <label>Paper Title</label>
                                    <input {...input} type="text" placeholder="Paper Title" />
                                    {meta.error && meta.touched && <span>{meta.error}</span>}
                                </div>
                            )}
                        </Field>

                        <div>
                            <label>Paper-Type</label>
                            <Field name="type" component="select"
                                   validate={composeValidators(required)}
                            >
                                <option value="">Select the Paper Type</option>
                                <option value="pastPaper">Past Paper</option>
                                <option value="markingScheme">Marking Scheme</option>
                                <option value="modelPaper">Model Paper</option>
                            </Field>
                        </div>
                        <div>
                            <label>Subject</label>
                            <Field name="subject" component="select"
                                   validate={composeValidators(required)}
                            >
                                <option value="">Select a Subject</option>
                                <option value="Physics">Physics</option>
                                <option value="Biology">Chemistry</option>
                                <option value="CombinedMaths">Combined Maths</option>
                                <option value="Biology">Biology</option>
                                <option value="Accounting">Accounting</option>
                                <option value="Business Studies">Business Studies</option>
                                <option value="Economy">Economy</option>
                                <option value="Logic">Logic</option>
                                <option value="Sinhala">Sinhala</option>
                                <option value="PoliticalScience">Political Science</option>
                                <option value="ICT">ICT</option>
                                <option value="EngineeringTechnology">Engineering Technology</option>
                                <option value="BioScienceTechnology">Bio Science Technology</option>
                            </Field>
                        </div>
                        <Field
                            name="year"
                            validate={composeValidators(required, mustBeNumber, minValue(1900))}
                        >
                            {({ input, meta }) => (
                                <div>
                                    <label>Year</label>
                                    <input {...input} type="text" placeholder="Year" />
                                    {meta.error && meta.touched && <span>{meta.error}</span>}
                                </div>
                            )}
                        </Field>
                        <Field name="url" validate={required}>
                            {({ input, meta }) => (
                                <div>
                                    <label>Paper URL</label>
                                    <input {...input} type="text" placeholder="URL" />
                                    {meta.error && meta.touched && <span>{meta.error}</span>}
                                </div>
                            )}
                        </Field>
                        <div className="buttons">
                            <button type="submit"
                                    disabled={submitting}>
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={form.reset}
                                disabled={submitting || pristine}
                            >
                                Reset
                            </button>
                        </div>
                        <pre className="d-flex ">{JSON.stringify(values, 0, 2)}</pre>
                    </form>
                )}
            />
            <h2 className={`text-${color}`}>{error!==null? error: null}</h2>
        </Styles>

    );
}

export default App;
