import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Text as SVGText} from "react-native-svg";
import {
  Card, CardActions, CardContent, Text, Title, Toolbar, ToolbarAction,
  ToolbarContent
} from "react-native-paper";
import {BarChart, PieChart, YAxis, Grid} from "react-native-svg-charts";
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


class HomeScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Lightning Stats',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
  };
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const {firestore} = this.context.store;
    firestore.get('makereadies');
  }

  _random_rgba() {
    let o = Math.round, r = Math.random, s = 225;
    let result = 'rgba(' + o((r() * s) + 25) + ',' + o((r() * s) + 25) + ',' + o((r() * s) + 25) + ',1.0 )';
    // console.log('random rgb: ' + result);
    return result;
  }

  render() {
    const user = this.props.navigation.getParam('user', {});
    console.log('HomeScreen render user: ' + user)
    return (

      <ScrollView>
        <LogoTitle navigation={this.props.navigation} user={user}/>
        {this.renderTurnoverPieChart()}
        <Text>Poop dee poop</Text>
        {this.renderUpgradesBarChart()}
        {this.renderAvgPriceBarChart()}
        {this.renderTurnoversByProps()}

      </ScrollView>
    );
  }

  renderUpgradesBarChart() {
    if (this.props.makereadyData) {
      const makereadies = this.props.makereadyData;
      let totalGranite = 0;
      let totalShower = 0;
      let totalMicrowave = 0;

      for (let i = 0; i < makereadies.length; i++) {
        if (makereadies[i].contracts[1]) {
          totalGranite++;
        }
        if (makereadies[i].contracts[2]) {
          totalShower++;
        }
        if (makereadies[i].contracts[3]) {
          totalMicrowave++;
        }
      }
      const extrasData = [
        {
          value: totalGranite,
          label: 'Granite',
          svg: {
            fill: 'rgba(33,150,243, 1.0)'
          },
        },
        {
          value: totalShower,
          label: 'Shower Tile',
          svg: {
            fill: 'rgba(38,166,154, 1.0)'
          },
        },
        {
          value: totalMicrowave,
          label: 'Microwave',
          svg: {
            fill: 'rgba(230,81,0, 1.0)'
          },
        },
      ];

      const CUT_OFF = 20;
      const LabelsUpgrades = ({x, y, bandwidth, data}) => (
        data.map((value, index) => (
          <SVGText
            key={index}
            x={10}
            y={y(index) + (bandwidth / 2)}
            fontSize={14}
            fill={value.value >= CUT_OFF ? 'white' : 'black'}
            alignmentBaseline={'middle'}
          >{value.label} ({value.value})</SVGText>
        )));
      return (
        <Card>
          <CardContent>
            <Title>Upgrades</Title>
            <View style={{flexDirection: 'row', height: 200, paddingVertical: 16}}>
              <BarChart
                style={{flex: 1, marginLeft: 8}}
                data={extrasData}
                horizontal={true}
                yAccessor={({item}) => item.value}
                svg={{fill: 'rgba(134, 65, 244, 0.8)'}}
                contentInset={{top: 10, bottom: 10}}
                spacing={0.2}
                gridMin={0}
              >
                <LabelsUpgrades/>
              </BarChart>
            </View>
          </CardContent>
        </Card>
      )
    }
    else {
      return (
        <Card>
          <CardContent>
            <ActivityIndicator size="large" color="#0000ff"/>
          </CardContent>
        </Card>
      )
    }

  }

  renderTurnoverPieChart() {

    if (this.props.makereadyData) {
      let makereadies = this.props.makereadyData;
      let lightCount = 0, lightPriceTotal = 0;
      let mediumCount = 0, mediumPriceTotal = 0;
      let heavyCount = 0, heavyPriceTotal = 0;

      for (let i = 0; i < makereadies.length; i++) {
        let type = makereadies[i].scope.mrType;
        let price = makereadies[i].scope.totalPrice;
        if (type === 'Light') {
          lightCount++;
          lightPriceTotal += price;
        } else if (type === 'Medium') {
          mediumCount++;
          mediumPriceTotal += price;
        } else if (type === 'Heavy') {
          heavyCount++;
          heavyPriceTotal += price;
        }
      }
      let lightPriceAvg = lightPriceTotal / lightCount;
      let mediumPriceAvg = mediumPriceTotal / mediumCount;
      let heavyPriceAvg = heavyPriceTotal / heavyCount;

      const data = [
        {
          key: 1,
          value: lightCount,
          svg: {fill: '#2196F3'},
          name: 'Light (' + lightCount + ')',
        },
        {
          key: 2,
          value: mediumCount,
          svg: {fill: '#26A69A'},
          name: 'Medium (' + mediumCount + ')',
        },
        {
          key: 3,
          value: heavyCount,
          svg: {fill: '#E65100'},
          name: 'Heavy (' + heavyCount + ')',
        },
      ];

      const Labels = ({slices, height, width}) => {
        return slices.map((slice, index) => {
          const {labelCentroid, pieCentroid, data} = slice;
          return (
            <SVGText
              key={index}
              x={pieCentroid[0]}
              y={pieCentroid[1]}
              fill={'black'}
              textAnchor={'start'}
              alignmentBaseline={'middle'}
              fontSize={14}
              stroke={'black'}
              strokeWidth={0.2}>
              {data.name}
            </SVGText>
          )
        })
      };

      return (
        <Card>
          <CardContent>
            <Title>Turnover Types</Title>
            <PieChart
              style={{height: 200}}
              data={data}
              spacing={0}
              outerRadius={'95%'}>
              <Labels/>
            </PieChart>
          </CardContent>
        </Card>
      )
    }
    else {
      return (
        <Card>
          <CardContent>
            <ActivityIndicator size="large" color="#0000ff"/>
          </CardContent>
        </Card>
      )
    }
  }

  renderAvgPriceBarChart() {

    if (this.props.makereadyData) {
      let makereadies = this.props.makereadyData;
      let lightCount = 0, lightPriceTotal = 0;
      let mediumCount = 0, mediumPriceTotal = 0;
      let heavyCount = 0, heavyPriceTotal = 0;

      for (let i = 0; i < makereadies.length; i++) {
        let type = makereadies[i].scope.mrType;
        let price = makereadies[i].scope.totalPrice;
        if (type === 'Light') {
          lightCount++;
          lightPriceTotal += price;
        } else if (type === 'Medium') {
          mediumCount++;
          mediumPriceTotal += price;
        } else if (type === 'Heavy') {
          heavyCount++;
          heavyPriceTotal += price;
        }
      }
      let lightPriceAvg = lightPriceTotal / lightCount;
      let mediumPriceAvg = mediumPriceTotal / mediumCount;
      let heavyPriceAvg = heavyPriceTotal / heavyCount;

      const barChartData = [
        {
          amount: parseFloat(Math.round(lightPriceAvg * 100) / 100),
          svg: {
            fill: 'rgba(33,150,243, 1.0)'
          },
          name: 'Light'
        },
        {
          amount: parseFloat(Math.round(mediumPriceAvg * 100) / 100),
          svg: {
            fill: 'rgba(38,166,154, 1.0)'
          },
          name: 'Medium'
        },
        {
          amount: parseFloat(Math.round(heavyPriceAvg * 100) / 100),
          svg: {
            fill: 'rgba(230,81,0, 1.0)'
          },
          name: 'Heavy'
        },
      ];

      const CUT_OFF = 20;
      const BarChartLabels = ({x, y, bandwidth, data}) => (
        data.map((value, index) => (
          <SVGText
            key={index}
            x={x(index) + (bandwidth / 2)}
            y={value.amount < CUT_OFF ? y(value.amount) - 10 : y(value.amount) + 15}
            fontSize={14}
            fill={value.amount >= CUT_OFF ? 'white' : 'black'}
            alignmentBaseline={'baseline'}
            textAnchor={'start'}
          >
            {value.amount}
          </SVGText>
        ))
      );

      return (
        <Card style={{flex: 1}}>
          <CardContent>
            <Title>Average Prices by type</Title>
            <View style={{flexDirection: 'row', height: 200, paddingVertical: 16}}>
              <BarChart
                style={{flex: 1}}
                data={barChartData}
                svg={{fill: 'rgba(134, 65, 244, 0.8)'}}
                yAccessor={({item}) => item.amount}
                contentInset={{top: 10, bottom: 10}}
                spacing={0.2}
                gridMin={0}
              >
                <BarChartLabels/>
              </BarChart>
            </View>
          </CardContent>
          <CardActions>

          </CardActions>
        </Card>
      )
    }
    else {
      return (
        <Card>
          <CardContent>
            <ActivityIndicator size="large" color="#0000ff"/>
          </CardContent>
        </Card>
      )
    }
  }

  renderTurnoversByProps() {
    if (this.props.makereadyData) {

      const filterData = this.props.makereadyData
        .map(({propertyName}) => propertyName)
        .reduce((names, propertyName) => {
          const count = names[propertyName] || 0;
          names[propertyName] = count + 1;
          return names;
        }, {});

      const propByNumsData = [
        {
          label: 'Alamo',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Alamo'] ? filterData['Alamo'] : 0
        },
        {
          label: 'Banyan Tree',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Banyan Tree'] ? filterData['Banyan Tree'] : 0
        },
        {
          label: 'Cabana',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Cabana'] ? filterData['Cabana'] : 0
        },
        {
          label: 'Diplomat',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Diplomat'] ? filterData['Diplomat'] : 0
        },
        {
          label: 'Hillside',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Hillside'] ? filterData['Hillside'] : 0
        },
        {
          label: 'Houses',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Houses'] ? filterData['Houses'] : 0
        },
        {
          label: 'Kennedy',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Kennedy'] ? filterData['Kennedy'] : 0
        },
        {
          label: 'La Hacienda',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['La Hacienda'] ? filterData['La Hacienda'] : 0
        },
        {
          label: 'Legacy',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Legacy'] ? filterData['Legacy'] : 0
        },
        {
          label: 'Lockwood',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Lockwood'] ? filterData['Lockwood'] : 0
        },
        {
          label: 'Marbach',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Marbach'] ? filterData['Marbach'] : 0
        },
        {
          label: 'Mandalay',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Mandalay'] ? filterData['Mandalay'] : 0
        },
        {
          label: 'Riviera',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Riviera'] ? filterData['Riviera'] : 0
        },
        {
          label: 'Springvale',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Springvale'] ? filterData['Springvale'] : 0
        },
        {
          label: 'Sulphur',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Sulphur'] ? filterData['Sulphur'] : 0
        },
        {
          label: 'Sir John',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Sir John'] ? filterData['Sir John'] : 0
        },
        {
          label: 'Westwinds',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Westwinds'] ? filterData['Westwinds'] : 0
        },
        {
          label: 'Westbury',
          svg: {
            fill: this._random_rgba()
          },
          value: filterData['Westbury'] ? filterData['Westbury'] : 0
        },
      ];

      const CUT_OFF = 8;
      const LabelsByProperties = ({x, y, bandwidth, data}) => (
        data.map((value, index) => (
          <SVGText
            key={index}
            x={10}
            y={y(index) + (bandwidth / 2)}
            fontSize={14}
            fill={value.value >= CUT_OFF ? 'white' : 'black'}
            alignmentBaseline={'middle'}
          >{value.label} ({value.value})</SVGText>
        )));

      return (
        <Card>
          <CardContent>
            <Title>Make Readies by Property</Title>
            <View style={{flexDirection: 'row', height: 600, paddingVertical: 16}}>

              <BarChart
                style={{flex: 1, marginLeft: 8}}
                data={propByNumsData}
                horizontal={true}
                yAccessor={({item}) => item.value}
                svg={{fill: 'rgba(134, 65, 244, 0.8)'}}
                contentInset={{top: 10, bottom: 10}}
                spacing={0.8}
                gridMin={0}
              >
                <LabelsByProperties/>
              </BarChart>
            </View>
          </CardContent>
        </Card>
      )
    }
    else {
      return (
        <Card>
          <CardContent>
            <ActivityIndicator size="large" color="#0000ff"/>
          </CardContent>
        </Card>
      )
    }
  }
}

const mapStateToProps = (state) => {
  let orderedData = state.firestore.ordered.makereadies;
  return {
    makereadyData: orderedData
  }
};
export default connect(mapStateToProps)(HomeScreen)

const styles = StyleSheet.create({
  bigblue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
  listitem: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginHorizontal: 8
  },
  toolbar: {
    backgroundColor: '#FF0266',
  }
});


class LogoTitle extends React.Component {
  render() {
    const user = this.props.user;
    console.log('LogoTitle user: ' + user);
    return (
      <Toolbar style={styles.toolbar}>
        <ToolbarAction icon="menu" onPress={this._toggleDrawer}/>
        <ToolbarContent
          title="Lightning Turnovers"
        />
        <ToolbarAction icon="settings" onPress={this._goToAuthPage(user)}/>
      </Toolbar>
    );
  }

  _toggleDrawer = () => {
    this.props.navigation.toggleDrawer();
  };

  _goToAuthPage(user) {
    console.log('HomeScreen, user: ' + user);
    // this.props.navigation.navigate('SignOut', {user: user});
  };
}