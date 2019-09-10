import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router';
import { Loading } from './components/global/simpleUiComponents';
import ErrorBoundary from './components/global/ErrorBoundary';

const PostsList = lazy(() => import(/* webpackChunkName: "PostsList" */'./components/PostsList'));
const NewPost = lazy(() => import(/* webpackChunkName: "NewPost" */'./components/NewPost'));
const PostDetail = lazy(() => import(/* webpackChunkName: "PostDetail" */'./components/PostDetail'));
const Header = lazy(() => import(/* webpackChunkName: "Header" */'./components/Header'));
function ContinuerWrapper(props) {
  return (
    <div className='app-root'>
      <header>
        <div className='continuer header'>
          <Suspense fallback={<Loading />}>
            <Header />
          </Suspense>
        </div>
      </header>
      <section>
        <div className='continuer body'>
          <Suspense fallback={<Loading />}>
            <ErrorBoundary>
              {props.children}
            </ErrorBoundary>
          </Suspense>
        </div>
      </section>
      {/* <footer>
            <div className='continuer footer'>
                <Suspense fallback={<Loading />}>
                    <Footer />
                </Suspense>
            </div>
          </footer> */}
    </div>
  );
}
ContinuerWrapper.defaultProps = {
  children: PropTypes.element.isRequired
};
export default function Router(props) {
  return (
    <ContinuerWrapper >
      <Switch>
        <Route exact path='/' component={PostsList} />
        <Route exact path='/posts/new' component={NewPost} />
        <Route path='/posts/:id' component={PostDetail} />
      </Switch>
    </ContinuerWrapper>
  );
}