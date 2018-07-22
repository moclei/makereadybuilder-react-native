import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Text as SVGText} from "react-native-svg";
import {
  Card, CardActions, CardContent, Title, Toolbar, ToolbarAction,
  ToolbarContent
} from "react-native-paper";
import firebase from 'react-native-firebase';
import {BarChart, PieChart, YAxis} from "react-native-svg-charts";
import * as scale from 'd3-scale';
import { connect } from 'react-redux';
import { listMakeReadies } from './reducer';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Lightning Stats',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
  };

  constructor() {
    super();
    this.ref = firebase.firestore().collection('makereadies');
    this.unsubscribe = null;
    this.state = {
      loading: true,
      loadingLights: true,
      loadingMediums: true,
      loadingHeavies: true,
      mrData: [],
      numberLight: 0,
      numberMediums: 0,
      numberHeavy: 0,
      totalPriceLight: 0,
      totalPriceMedium: 0,
      totalPriceHeavy: 0,
      totalGranite: 0,
      totalShower: 0,
      totalMicrowave: 0,
      numbersByProperty: [],
      filterData: [],
    };
  }

  componentDidMount() {
    this.unsubscribeRedux = this.props.listMakeReadies();
    this.unsubscribeLightCount = this.ref.where("scope.mrType", "==", "Light").onSnapshot(this.onCollectionUpdateLight);
    this.unsubscribeMedCount = this.ref.where("scope.mrType", "==", "Medium").onSnapshot(this.onCollectionUpdateMedium);
    this.unsubscribeHeavyCount = this.ref.where("scope.mrType", "==", "Heavy").onSnapshot(this.onCollectionUpdateHeavy);
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  componentWillUnmount() {
    this.unsubscribeRedux();
    this.unsubscribeMedCount();
    this.unsubscribeLightCount();
    this.unsubscribeHeavyCount();
    this.unsubscribe();
  }
  onCollectionUpdate = (querySnapshot) => {
    const makereadies = [];
    let totalGranite = 0;
    let totalShower = 0;
    let totalMicrowave = 0;
    querySnapshot.forEach((doc) =>  {
      const { timestamp, email, propertyName, preparerName, unit,
        scope, contracts,  } = doc.data();
      makereadies.push({
        key: doc.id,
        doc, // DocumentSnapshot
        timestamp,
        email,
        propertyName,
        preparerName,
        unit,
        scope,
        contracts,
      });
      if (contracts[1]) {
        totalGranite++;
      }
      if (contracts[2]) {
        totalShower++;
      }
      if (contracts[3]) {
        totalMicrowave++;
      }
    });

    const filterData = makereadies
      .map(({ propertyName }) => propertyName)
      .reduce((names, propertyName) => {
        const count = names[propertyName] || 0;
        names[propertyName] = count + 1;
        return names;
      }, {});

    let numbersByProperty =
      Object
      .entries(filterData)
      .map(([key, value]) =>
        (
          {
            name: key,
            count: value,
            svg: {
              fill: this._random_rgba
            }
          }));

    // console.log('totalGranite: ' + totalGranite + ', totalShower: ' + totalShower + ' totalMicrowave: ' + totalMicrowave);
    this.setState({
      loading: false,
      totalGranite: totalGranite,
      totalShower: totalShower,
      totalMicrowave: totalMicrowave,
      numbersByProperty: numbersByProperty,
      filterData: filterData
    });
  };
  onCollectionUpdateLight = (querySnapshot) => {
    let lightCount = 0;
    let priceCount = 0;
    querySnapshot.forEach((doc) =>  {
      const { timestamp, email, propertyName, preparerName, unit,
        scope, contracts,  } = doc.data();
      lightCount++;
      priceCount += scope.totalPrice;
    });
    this.setState({
      loadingLights: false,
      numberLight: lightCount,
      totalPriceLight: priceCount/lightCount,
    });
  };
  onCollectionUpdateMedium = (querySnapshot) => {
    let mediumCount = 0;
    let priceCount = 0;
    querySnapshot.forEach((doc) =>  {
      const { timestamp, email, propertyName, preparerName, unit,
        scope, contracts,  } = doc.data();
      mediumCount++;
      priceCount += scope.totalPrice;
    });
    this.setState({
      loadingMediums: false,
      numberMediums: mediumCount,
      totalPriceMedium: priceCount/mediumCount,
    });
  };
  onCollectionUpdateHeavy = (querySnapshot) => {
    let heavyCount = 0;
    let priceCount = 0;
    querySnapshot.forEach((doc) =>  {
      const { timestamp, email, propertyName, preparerName, unit,
        scope, contracts,  } = doc.data();
      heavyCount++;
      priceCount += scope.totalPrice;
    });
    this.setState({
      loadingHeavies: false,
      numberHeavy: heavyCount,
      totalPriceHeavy: priceCount/heavyCount,
    });
  };

  _random_rgba() {
    let o = Math.round, r = Math.random, s = 255;
    let result = 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
    console.log('random rgb: ' + result);
    return result;
  }

  render() {
    const user = this.props.navigation.getParam('user', {});
    console.log('HomeScreen render user: ' + user);

    const data = [
      {
        key: 1,
        value: this.state.numberLight,
        svg: { fill: '#2196F3' },
        name: 'Light (' + this.state.numberLight + ')',
      },
      {
        key: 2,
        value: this.state.numberMediums,
        svg: { fill: '#26A69A' },
        name: 'Medium (' +this.state.numberMediums + ')',
      },
      {
        key: 3,
        value: this.state.numberHeavy,
        svg: { fill: '#E65100' },
        name: 'Heavy (' + this.state.numberHeavy + ')',
      },
    ];

    const barChartData = [
      {
        amount: parseFloat(Math.round(this.state.totalPriceLight * 100) / 100),
        svg: {
          fill: 'rgba(33,150,243, 1.0)'
        },
        name: 'Light'
      },
      {
        amount: parseFloat(Math.round(this.state.totalPriceMedium * 100) / 100),
        svg: {
          fill: 'rgba(38,166,154, 1.0)'
        },
        name: 'Medium'
      },
      {
        amount: parseFloat(Math.round(this.state.totalPriceHeavy * 100) / 100),
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        name: 'Heavy'
      },
   ];

    const extrasData = [
      {
        value: this.state.totalGranite,
        label: 'Granite',
        svg: {
          fill: 'rgba(33,150,243, 1.0)'
        },
      },
      {
        value: this.state.totalShower,
        label: 'Shower Tile',
        svg: {
          fill: 'rgba(38,166,154, 1.0)'
        },
      },
      {
        value: this.state.totalMicrowave,
        label: 'Microwave',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
      },
    ];

    const propByNumsData = [
      {
        label: 'Alamo',
        svg: { fill: 'rgba(33,150,243, 1.0)'},
        value: this.state.filterData['Alamo'] ? this.state.filterData['Alamo'] : 0
      },
      {
        label: 'Banyan Tree',
        svg: {
          fill: 'rgba(38,166,154, 1.0)'
        },
        value: this.state.filterData['Banyan Tree']  ? this.state.filterData['Banyan Tree'] : 0
      },
      {
        label: 'Cabana',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Cabana'] ? this.state.filterData['Cabana'] : 0
      },
      {
        label: 'Diplomat',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Diplomat'] ? this.state.filterData['Diplomat'] : 0
      },
      {
        label: 'Hillside',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Hillside'] ? this.state.filterData['Hillside'] : 0
      },
      {
        label: 'Houses',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Houses'] ? this.state.filterData['Houses'] : 0
      },
      {
        label: 'Kennedy',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Kennedy'] ? this.state.filterData['Kennedy'] : 0
      },
      {
        label: 'La Hacienda',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['La Hacienda'] ? this.state.filterData['La Hacienda'] : 0
      },
      {
        label: 'Legacy',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Legacy'] ? this.state.filterData['Legacy'] : 0
      },
      {
        label: 'Lockwood',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Lockwood'] ? this.state.filterData['Lockwood'] : 0
      },
      {
        label: 'Marbach',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Marbach'] ? this.state.filterData['Marbach'] : 0
      },
      {
        label: 'Mandalay',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Mandalay'] ? this.state.filterData['Mandalay'] : 0
      },
      {
        label: 'Riviera',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Riviera'] ? this.state.filterData['Riviera'] : 0
      },
      {
        label: 'Springvale',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Springvale'] ? this.state.filterData['Springvale'] : 0
      },
      {
        label: 'Sulphur',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Sulphur'] ? this.state.filterData['Sulphur'] : 0
      },
      {
        label: 'Sir John',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Sir John'] ? this.state.filterData['Sir John'] : 0
      },
      {
        label: 'Westwinds',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Westwinds'] ? this.state.filterData['Westwinds'] : 0
      },
      {
        label: 'Westbury',
        svg: {
          fill: 'rgba(230,81,0, 1.0)'
        },
        value: this.state.filterData['Westbury'] ? this.state.filterData['Westbury'] : 0
      },
    ];

    return (

      <ScrollView>
        <LogoTitle navigation={this.props.navigation} user={user}/>
        {this.renderTurnoverPieChart(data)}
        {this.renderUpgradesBarChart(extrasData)}
        {this.renderAvgPriceBarChart(barChartData)}
        {this.renderTurnoversByProps(propByNumsData)}





      </ScrollView>
    );
  }

  renderUpgradesBarChart(extrasData){
    if (!this.state.loading) {
      return (
        <Card>
          <CardContent>
            <Title>Upgrades</Title>
            <View style={{ flexDirection: 'row', height: 200, paddingVertical: 16 }}>
              <YAxis
                data={extrasData}
                yAccessor={({ index }) => index}
                scale={scale.scaleBand}
                contentInset={{ top: 10, bottom: 10 }}
                spacing={0.2}
                formatLabel={(_, index) => extrasData[ index ].label + ': ' + extrasData[ index ].value}
              />
              <BarChart
                style={{ flex: 1, marginLeft: 8 }}
                data={extrasData}
                horizontal={true}
                yAccessor={({ item }) => item.value}
                svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                contentInset={{ top: 10, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
              >
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
            <ActivityIndicator size="large" color="#0000ff" />
          </CardContent>
        </Card>
      )
    }
  }


  renderTurnoverPieChart(data){
    const Labels = ({ slices, height, width }) => {
      return slices.map((slice, index) => {
        const { labelCentroid, pieCentroid, data } = slice;
        return (
          <SVGText
            key={index}
            x={pieCentroid[ 0 ]}
            y={pieCentroid[ 1 ]}
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
    if (!this.state.loadingLights && !this.state.loadingMediums && !this.state.loadingHeavies) {
      return (
        <Card>
          <CardContent>
            <Title>Turnover Types</Title>
            <PieChart
              style={{ height: 200 }}
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
              <ActivityIndicator size="large" color="#0000ff" />
          </CardContent>
        </Card>
      )
    }
  }

  renderAvgPriceBarChart(barChartData){
    const CUT_OFF = 20;
    const BarChartLabels = ({ x, y, bandwidth, data }) => (
      data.map((value, index) => (
        <SVGText
          key={ index }
          x={ x(index) + (bandwidth / 2) }
          y={ value.amount < CUT_OFF ? y(value.amount) - 10 : y(value.amount) + 15 }
          fontSize={ 14 }
          fill={ value.amount >= CUT_OFF ? 'white' : 'black' }
          alignmentBaseline={ 'baseline' }
          textAnchor={ 'start' }
        >
          {value.amount}
        </SVGText>
      ))
    );
    if (!this.state.loadingLights && !this.state.loadingMediums && !this.state.loadingHeavies) {
      return (
        <Card style={{ flex: 1 }}>
          <CardContent>
            <Title>Average Prices by type</Title>
            <View style={{ flexDirection: 'row', height: 200, paddingVertical: 16 }}>
              <BarChart
                style={{ flex: 1 }}
                data={barChartData}
                svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                yAccessor={({ item }) => item.amount}
                contentInset={{ top: 10, bottom: 10 }}
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
            <ActivityIndicator size="large" color="#0000ff" />
          </CardContent>
        </Card>
      )
    }
  }

  renderTurnoversByProps(propByNumsData){
    if (!this.state.loading) {
      return (
        <Card>
          <CardContent>
            <Title>Make Readies by Property</Title>
            <View style={{ flexDirection: 'row', height: 400, paddingVertical: 16 }}>
              <YAxis
                data={propByNumsData}
                yAccessor={({ index }) => index}
                scale={scale.scaleBand}
                contentInset={{ top: 10, bottom: 10 }}
                spacing={0.8}
                formatLabel={(_, index) => propByNumsData[ index ].label + ': ' + propByNumsData[ index ].value}
              />
              <BarChart
                style={{ flex: 1, marginLeft: 8 }}
                data={propByNumsData}
                horizontal={true}
                yAccessor={({ item }) => item.value}
                svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                contentInset={{ top: 10, bottom: 10 }}
                spacing={0.8}
                gridMin={0}
              >
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
            <ActivityIndicator size="large" color="#0000ff" />
          </CardContent>
        </Card>
      )
    }
  }
}


/* <Grid direction={Grid.Direction.HORIZONTAL}/>*/

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