import * as React from 'react';
import { PageComponentProps, Pilet } from 'piral-core';
import { FormProps } from 'piral-forms';

interface SampleFormData {
  firstName: string;
  lastName: string;
}

/**
 * Shows a form.
 */
export const FormPilet: Pilet = {
  content: '',
  name: 'Form Module',
  version: '1.0.0',
  hash: '429',
  setup(piral) {
    class MyForm extends React.Component<PageComponentProps & FormProps<SampleFormData>> {
      render() {
        const { formData, changeForm, changed, submitting, reset, error } = this.props;
        const { firstName, lastName } = formData;

        return (
          <div>
            <div className="form-row">
              <label>First Name:</label>
              <input value={firstName} name="firstName" onChange={changeForm} />
            </div>
            <div className="form-row">
              <label>Last Name:</label>
              <input value={lastName} name="lastName" onChange={changeForm} />
            </div>
            <div className="form-row">
              <button disabled={!changed || submitting}>{submitting ? 'Saving ...' : 'Save'}</button>{' '}
              {!submitting && (
                <>
                  {'| '}
                  <button disabled={!changed} type="button" onClick={reset}>
                    Reset
                  </button>
                </>
              )}
            </div>
            {error && (
              <div className="form-row">
                <div className="notification error">
                  <div className="notification-content">
                    <div className="notification-message">{error.message}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    const withSimpleForm = piral.createForm({
      message: `Really lose the data?`,
      emptyData: {
        firstName: '',
        lastName: '',
      },
      onSubmit(data) {
        console.log('Submitting simple data ...', data);
        return new Promise(resolve =>
          setTimeout(() => {
            resolve();
            console.log('Submitted simple data!', data);
          }, 5000),
        );
      },
    });
    piral.registerPage('/form-simple-example', withSimpleForm(MyForm));

    const withAsyncForm = piral.createForm({
      message: `Really lose the data?`,
      emptyData: {
        firstName: '',
        lastName: '',
      },
      onSubmit(data) {
        console.log('Submitting async data ...', data);
        return new Promise(resolve =>
          setTimeout(() => {
            resolve();
            console.log('Submitted async data!', data);
          }, 5000),
        );
      },
      loadData(props: PageComponentProps) {
        return new Promise<SampleFormData>(resolve =>
          setTimeout(
            () =>
              resolve({
                firstName: 'My',
                lastName: 'User_' + props.match.params.id,
              }),
            5000,
          ),
        );
      },
    });
    piral.registerPage('/form-async-example/:id', withAsyncForm(MyForm) as any);

    const withFailingForm = piral.createForm({
      message: `Really lose the data?`,
      emptyData: {
        firstName: '',
        lastName: '',
      },
      onSubmit(data) {
        console.log('Submitting failing data ...', data);
        return new Promise((_, reject) => setTimeout(() => reject(new Error('The form failed!')), 3000));
      },
    });
    piral.registerPage('/form-failing-example', withFailingForm(MyForm));
  },
};
