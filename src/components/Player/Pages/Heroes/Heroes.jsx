import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import strings from 'lang';
import {
  getPlayerHeroes,
} from 'actions';
import Table from 'components/Table';
import Container from 'components/Container';
import { playerHeroesColumns } from './playerHeroesColumns';

const Heroes = ({
  data, playerId, error, loading, min_matches, handleChange, filtered,
}) => (
  <Container title={strings.heading_heroes} error={error} loading={loading}>
    <p>{strings.min_matches_played} {min_matches}</p>
    <Slider 
      style={{width:200}}
      min={0}
      max={100}
      step={1}
      onChange={handleChange}
    />
    <Table paginated columns={playerHeroesColumns(playerId)} data={filtered || data} />
  </Container>
);

Heroes.propTypes = {
  data: PropTypes.arrayOf({}),
  playerId: PropTypes.string,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

const getData = (props) => {
  props.getPlayerHeroes(props.playerId, props.location.search);
};

class RequestLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min_matches: 0,
      filtered: null,
    }
  }

  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.playerId !== nextProps.playerId || this.props.location.key !== nextProps.location.key) {
      getData(nextProps);
    }
  }

  handleChange(event, value) {
    const filtered = this.props.data.filter(hero => {
      return hero.games >= value;
    })

    this.setState({
      min_matches: value,
      filtered,
    })
  }

  render() {
    return (
      <Heroes 
        {...this.props}
        {...this.state} 
        handleChange={this.handleChange.bind(this)}  
      />
      
    );
  }
}

RequestLayer.propTypes = {
  location: PropTypes.shape({
    key: PropTypes.string,
  }),
  playerId: PropTypes.string,
};

const mapStateToProps = state => ({
  data: state.app.playerHeroes.data,
  error: state.app.playerHeroes.error,
  loading: state.app.playerHeroes.loading,
});

const mapDispatchToProps = dispatch => ({
  getPlayerHeroes: (playerId, options) => dispatch(getPlayerHeroes(playerId, options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
