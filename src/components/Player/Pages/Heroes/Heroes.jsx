import React from 'react';
import { connect } from 'react-redux';
import strings from 'lang';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {
  getPlayerHeroes,
} from 'actions';
import Table from 'components/Table';
import Container from 'components/Container';
import { playerHeroesColumns } from './playerHeroesColumns';

const Heroes = ({ data, playerId, error, loading, highFrequency }) => (
  <Container title={strings.heading_heroes} error={error} loading={loading}>
    <Table paginated columns={playerHeroesColumns(playerId)} data={highFrequency || data} />
  </Container>
);

const getData = (props) => {
  props.getPlayerHeroes(props.playerId, props.location.search);
};

class RequestLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequency: undefined,
      highFrequency: null,
    };
    this.filterHeroes = this.filterHeroes.bind(this);
  }
  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.playerId !== nextProps.playerId || this.props.location.key !== nextProps.location.key) {
      getData(nextProps);
    }
  }

  filterHeroes() {
    const frequency = this.state.frequency;
    const highFrequency = this.props.data.filter(hero => hero.games > frequency);
    this.setState({
      highFrequency,
    });
  }

  render() {
    return (
      <div>
        <SelectField
          floatingLabelText="Frequency"
          value={this.state.frequency}
          onChange={(event, index, value) => {
            this.setState({
              frequency: value,
            }, this.filterHeroes);
          }}
        >
          <MenuItem value={1} primaryText="low" />
          <MenuItem value={5} primaryText="medium" />
          <MenuItem value={10} primaryText="high" />
        </SelectField>
        <Heroes
          {...this.props}
          highFrequency={this.state.highFrequency}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.app.playerHeroes.data,
  error: state.app.playerHeroes.error,
  loading: state.app.playerHeroes.loading,
});

const mapDispatchToProps = dispatch => ({
  getPlayerHeroes: (playerId, options) => dispatch(getPlayerHeroes(playerId, options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
