/* eslint-disable react/jsx-no-bind */
import React, { Component, Suspense } from 'react';
import { Button, Input } from '../global/simpleUiComponents';
class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            type: "alert",
            subject: "",
            text: "",
            inserted: "",
            validation: '',
            options: {}
        };
    }
    alert(subject, text, options = {}) {
        this.setState({ isOpen: true, type: "alert", subject, text, options });
        return new Promise((resolve) => {
            this.Success = () => {
                this.setState({ isOpen: false });
                resolve(true);
            };
            this.Cancel = () => {
                this.setState({ isOpen: false });
                resolve(false);
            };
        });
    }
    confirm(subject, text, options = {}) {
        this.setState({ isOpen: true, type: "confirm", subject, text, options });
        return new Promise((resolve) => {
            this.Cancel = () => {
                this.setState({ isOpen: false });
                resolve(false);
            };
            this.Success = () => {
                this.setState({ isOpen: false });
                resolve(true);
            };
        });
    }
    prompt(subject, text, validation = new RegExp(''), options = {}) {
        this.setState({ isOpen: true, type: "prompt", subject, text, options, validation });
        return new Promise((resolve) => {
            this.Cancel = () => {
                this.setState({ isOpen: false, inserted: '', validation: new RegExp('') });
                resolve(false);
            };
            this.Success = (input, setError) => {
                this.setState({ isOpen: false, inserted: '', validation: new RegExp('') });
                resolve(input);
            };
        });
    }
    render() {
        const { isOpen, type, subject, text, validation, inserted } = this.state;
        const { placeholder = '', resolveButtonText = '', rejectButtonTetx = '' } = this.state.options;
        let switchedType = null;
        switch (type) {
            case "prompt":
                switchedType = (<form onSubmit={(e) => { e.preventDefault(); this.Success(inserted); }}>
                    <div className="modal-text">
                        <h1>{subject}</h1>
                        <p dangerouslySetInnerHTML={{ __html: text }} />
                        <Input
                            name='inserted'
                            placeholder={placeholder}
                            errorMessage='insert'
                            validation={validation}
                            value={inserted}
                            onChange={(name, value) => this.setState({ [name]: value })}
                        />
                    </div>
                    <div className="modal-btn">
                        <Suspense fallback='...'>
                            <Button type='submit' uppercase >{resolveButtonText || 'insert'}</Button>
                            <Button uppercase onClick={() => this.Cancel()}>{rejectButtonTetx || 'cancel'}</Button>
                        </Suspense>
                    </div>
                </form>);
                break;
            case "confirm":
                switchedType = (<React.Fragment>
                    <div className="modal-text">
                        <h1>{subject}</h1>
                        <p dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                    <div className="modal-btn">
                        <Suspense fallback='...'>
                            <Button uppercase onClick={() => this.Success()}>yes</Button>
                            <Button uppercase onClick={() => this.Cancel()}>no</Button>
                        </Suspense>
                    </div>
                </React.Fragment>);
                break;
            case "alert":
                switchedType = (<React.Fragment>
                    <div className="modal-text">
                        <h1>{subject}</h1>
                        <p>{text}</p>
                    </div>
                    <div className="modal-btn">
                        <Suspense fallback='...'>
                            <Button uppercase onClick={() => this.Success()}>ok</Button>
                        </Suspense>
                    </div>
                </React.Fragment>);
                break;
            default:
                switchedType = (<React.Fragment>
                    <div className="modal-text">
                        <h1>{subject}</h1>
                        <p>{text}</p>
                    </div>
                    <div className="modal-btn">
                        <Suspense fallback='...'>
                            <Button uppercase onClick={() => this.Success()}>ok</Button>
                        </Suspense>
                    </div>
                </React.Fragment>);
        }
        return (
            <div id='MODAL_WRAPER' onClick={(e) => {
                if (e.target.id === 'MODAL_WRAPER') {
                    this.Cancel();
                }
            }} className={`modal ${isOpen ? 'active' : ''}`}>
                <div className="modal-content">
                    {switchedType}
                </div>
            </div>
        );
    }
}
export default Modal;