import * as React from 'react';
import { ArbiterModule } from 'react-arbiter';
import { PiralApi, PageComponentProps, FormProps, PiralCoreApi } from 'piral-core';

interface SampleFormData {
  firstName: string;
  lastName: string;
}

/**
 * Shows a form.
 */
export const FormModule: ArbiterModule<PiralApi> = {
  content: '',
  dependencies: {},
  name: 'Form Module',
  version: '1.0.0',
  hash: '429',
  setup(piral) {
    const withForm = piral.createForm({
      message: `Really lose the data?`,
      initialData: {
        firstName: '',
        lastName: '',
      },
      onSubmit(data) {
        console.log('Submitting data', data);
        return new Promise(resolve => setTimeout(resolve, 5000));
      },
    });
    piral.registerPage(
      '/form-example',
      withForm(
        class extends React.Component<PageComponentProps<PiralCoreApi<{}>> & FormProps<SampleFormData>> {
          render() {
            const { formData, changeForm, changed, submitting, reset } = this.props;
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
              </div>
            );
          }
        },
      ),
    );
  },
};
