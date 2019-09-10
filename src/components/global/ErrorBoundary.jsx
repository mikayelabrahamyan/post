import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error(error, info);
    }
    render() {
        if (this.state.hasError) {
            return <div className='error-message'><p>{('Something went wrong Please try again')}</p></div>;
        }
        return this.props.children;
    }
}
export default (ErrorBoundary);