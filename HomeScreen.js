import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Text as SVGText} from "react-native-svg";
import {
  Button,
  Card, CardActions, CardContent, CardCover, Paragraph, Text, Title, Toolbar, ToolbarAction, ToolbarBackAction,
  ToolbarContent
} from "react-native-paper";
import firebase from 'react-native-firebase';
import {BarChart, Grid, PieChart} from "react-native-svg-charts";

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
      mrData: [],
      numberLight: 0,
      numberMediums: 0,
      numberHeavy: 0,
      totalPriceLight: 0,
      totalPriceMedium: 0,
      totalPriceHeavy: 0,
    };
  }

  componentDidMount() {
    this.unsubscribeLightCount = this.ref.where("scope.mrType", "==", "Light").onSnapshot(this.onCollectionUpdateLight);
    this.unsubscribeMedCount = this.ref.where("scope.mrType", "==", "Medium").onSnapshot(this.onCollectionUpdateMedium);
    this.unsubscribeHeavyCount = this.ref.where("scope.mrType", "==", "Heavy").onSnapshot(this.onCollectionUpdateHeavy);

  }
  componentWillUnmount() {
    this.unsubscribeMedCount();
    this.unsubscribeLightCount();
    this.unsubscribeHeavyCount();
  }
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
      loading: false,
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
      loading: false,
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
      loading: false,
      numberHeavy: heavyCount,
      totalPriceHeavy: priceCount/heavyCount,
    });
  };

  render() {
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

    const barChartDataBkp = [
      parseFloat(Math.round(this.state.totalPriceLight * 100) / 100),
      parseFloat(Math.round(this.state.totalPriceMedium * 100) / 100),
      parseFloat(Math.round(this.state.totalPriceHeavy * 100) / 100)];

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
          ${value.amount}
        </SVGText>
      ))
    );

    return (

      <ScrollView>
        <LogoTitle navigation={this.props.navigation}/>

        <Card>
          <CardContent>
            <Title>Turnover Types</Title>
            <PieChart
              style={{ height: 200 }}
              data={data}
              spacing={0}
              outerRadius={'95%'}
              data={data}>
                <Labels/>
            </PieChart>
          </CardContent>
        </Card>

        <Card>
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

      </ScrollView>
    );
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
    return (
      <Toolbar style={styles.toolbar}>
        <ToolbarAction icon="menu" onPress={this._toggleDrawer}/>
        <ToolbarContent
          title="Lightning Turnovers"
        />
      </Toolbar>
    );
  }

  _toggleDrawer = () => {
    this.props.navigation.toggleDrawer();
  };
}