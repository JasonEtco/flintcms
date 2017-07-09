import React, { Component } from 'react';
import Page from 'containers/Page';
import TitleBar from 'components/TitleBar';
import { get } from 'axios';
import './Logs.scss';

export default class Logs extends Component {
  static propTypes = {}

  state = { isFetching: true }

  componentDidMount() {
    get('/admin/api/logs')
      .then(({ data }) => {
        this.setState({ isFetching: false, data });
      });
  }

  render() {
    const { isFetching, data } = this.state;
    if (isFetching) return null;

    return (
      <Page name="logs">
        <TitleBar title="Logs" />

        <div className="content">
          <div className="page__inner" style={{ width: '100%' }}>
            <section className="logs__section">
              <h2>Flint Logs</h2>
              <pre className="logs__pre">
                <code>
                  {data.flint.map(s => `${s}\n`)}
                </code>
              </pre>
            </section>

            <section className="logs__section">
              <h2>HTTP Logs</h2>
              <pre className="logs__pre">
                <code>
                  {data.http.map(s => `${s}\n`)}
                </code>
              </pre>
            </section>
          </div>
        </div>
      </Page>
    );
  }
}
