import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView
} from 'react-native';
import {
  Title,
  Paragraph,
  Card,
  CardContent, CardCover, CardActions, Button, Text
} from 'react-native-paper';

export default class MakeReadyDetail extends React.PureComponent {
  // navigation.getParam('otherParam', 'A Nested Details Screen')
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params ? params.mr.propertyName + ' ' + params.mr.unit.unitName + ' - ' + params.mr.scope.mrType: 'Make Ready Details',
      headerStyle: {
        backgroundColor: '#FF0266',
        color: '#FFF',
      },
      headerTintColor: '#fff',
    };
  };

  render() {
    const data = this.props.navigation.getParam('mr', {});
    let createdOn = data.timestamp.split(',')[0];
    return (

      <ScrollView>

        <Card>
          <CardContent>
            <Title>Info</Title>
            <Paragraph>Make Ready Built on {createdOn} by {data.preparerName} ({data.email}) </Paragraph>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Title>Make Ready</Title>
            <Paragraph>
              <Text  style={{fontWeight: "bold"}}>Scope: </Text>
              <Text>{data.scope.scopeDescription}</Text>
            </Paragraph>
            <Paragraph>
              <Text  style={{fontWeight: "bold"}}>Unit Size: </Text>
              <Text>{data.unit.size} square feet </Text>
            </Paragraph>
            <Paragraph>
              <Text  style={{fontWeight: "bold"}}>Rate: </Text>
              <Text>${data.scope.baseMReadyRate} / sq. ft.</Text>
            </Paragraph>
            <MakeReadyCost data={data} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Title>Extras</Title>
            <MakeReadyExtras data={data} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Title>Service Agreement</Title>
            <MakeReadyContractor data={data} />
              <Paragraph>
                <Text  style={{fontWeight: "bold"}}>Start Date: </Text>
                <Text>{data.contracts[0].startDate}</Text>
              </Paragraph>
              <Paragraph>
                <Text  style={{fontWeight: "bold"}}>Contract Price: </Text>
                <Text>${data.contracts[0].price}</Text>
              </Paragraph>
          </CardContent>
        </Card>

        <ShowerContract data={data}/>
        <GraniteContract data={data}/>
        <MicrowaveContract data={data}/>
        <FlooringList data={data}/>
        <ApplianceList data={data}/>

      </ScrollView>
    );
  }
}

function MakeReadyCost(props) {
  const isFullTexture = props.data.scope.isFullTexture;
  if (isFullTexture) {
    return (
      <View>
        <Paragraph>
            <Text  style={{fontWeight: "bold"}}>Rate Add: </Text>
            <Text>$0.25 / sq. ft. additional for full texture. (${props.data.scope.baseMReadyRate} + $0.25 = ${props.data.scope.baseMReadyRate + 0.25})</Text>
        </Paragraph>
        <Paragraph>
          <Text  style={{fontWeight: "bold"}}>Total: </Text>
          <Text>${props.data.scope.totalPrice}</Text>
        </Paragraph>
      </View>
    );
  }
  return (
    <Paragraph>
      <Text  style={{fontWeight: "bold"}}>Total: </Text>
      <Text>${props.data.scope.totalPrice}</Text>
    </Paragraph>
  );
}

function MakeReadyExtras(props) {
  const hasExtras = props.data.scope.costOfExtras > 0;
  if (hasExtras) {
    return (
      <View>
        {props.data.scope.extras.extrasAsArray.map((extra, index) =>
          <Extra description={extra.description}
                 basicDescription={extra.basicDescription}
                 quantity={extra.quantity}
                 price={extra.price}
                 totalPrice={extra.totalPrice}
                 key={index}/>
        )}
        <Paragraph>
          <Text  style={{fontWeight: "bold"}}>Total of Extras: </Text>
          <Text>${props.data.scope.costOfExtras}</Text>
          </Paragraph>
      </View>
    );
  }
  return (
    <View>
      <Paragraph>No Extras</Paragraph>
    </View>
  );
}

function Extra(props) {
  return (
    <Paragraph>
      {props.description} @ ${props.price} each = ${props.totalPrice}
      </Paragraph>
  )
}

function MakeReadyContractor(props) {
  const contractorName = props.data.contracts[0].contractor;
  if (contractorName) {
    return (
      <Paragraph>
        <Text  style={{fontWeight: "bold"}}>Contractor: </Text>
        <Text>{props.data.contracts[0].contractor}</Text>
      </Paragraph>
    );
  }
  return (
    <Paragraph>
      <Text  style={{fontWeight: "bold"}}>Contract created blank.</Text>
    </Paragraph>
  );
}


function ShowerContract(props) {
  const showerTile = props.data.scope.showerTile;
  if (showerTile) {
    return (
      <View>
        <Card>
          <CardContent>
            <Title>Shower Tile Service Agreement</Title>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Scope: </Text>
              <Text>{props.data.contracts[2].scope}</Text>
            </Paragraph>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Contractor: </Text>
              <Text>{props.data.contracts[2].contractor ? props.data.contracts[2].contractor : "No contractor picked"}</Text>
            </Paragraph>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Start Date: </Text>
              <Text>{props.data.contracts[2].startDate}</Text>
            </Paragraph>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Price: </Text>
              <Text>${props.data.contracts[2].price}</Text>
            </Paragraph>
          </CardContent>
        </Card>
      </View>
    );
  }
  return (
    <View>
    </View>
  );
}

function GraniteContract(props) {
  const granite = props.data.scope.granite;
  if (granite) {
    return (
      <View>
        <Card>
          <CardContent>
            <Title>Granite Service Agreement</Title>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Scope: </Text>
              <Text>{props.data.contracts[1].scope}</Text>
            </Paragraph>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Contractor: </Text>
              <Text>{props.data.contracts[1].contractor ? props.data.contracts[1].contractor : "No contractor picked"}</Text>
            </Paragraph>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Start Date: </Text>
              <Text>{props.data.contracts[1].startDate}</Text>
            </Paragraph>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Price: </Text>
              <Text>${props.data.contracts[1].price}</Text>
            </Paragraph>
          </CardContent>
        </Card>
      </View>
    );
  }
  return (
    <View>
    </View>
  );
}


function MicrowaveContract(props) {
  const microwave = props.data.scope.microwave;
  if (microwave) {
    return (
      <View>
        <Card>
          <CardContent>
            <Title>Microwave Service Agreement</Title>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Scope: </Text>
              <Text>{props.data.contracts[3].scope}</Text>
            </Paragraph>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Contractor: </Text>
              <Text>{props.data.contracts[3].contractor ? props.data.contracts[3].contractor : "No contractor picked"}</Text>
            </Paragraph>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Start Date: </Text>
              <Text>{props.data.contracts[3].startDate}</Text>
            </Paragraph>
            <Paragraph>
              <Text style={{fontWeight: "bold"}}>Price: </Text>
              <Text>${props.data.contracts[3].price}</Text>
            </Paragraph>
          </CardContent>
        </Card>
      </View>
    );
  }
  return (
    <View>
    </View>
  );
}

function FlooringList(props) {
  const flooring = props.data.scope.flooring.flooringList.length > 0;
  if (flooring) {
    return (
      <Card>
        <CardContent>
          <Title>Flooring</Title>
          <View>
            {props.data.scope.flooring.flooringList.map((floor, index) =>
              <Floor description={floor.description}
                     quantity={floor.qty}
                     key={index}/>
            )}
          </View>
        </CardContent>
      </Card>

    );
  }
  return (
    <View>
    </View>
  );
}

function Floor(props) {
  return (
    <Paragraph>
      {props.description} @ {props.quantity}
    </Paragraph>
  )
}

function ApplianceList(props) {
  const appliances = props.data.scope.applianceList.length > 0;
  if (appliances) {
    return (
      <Card>
        <CardContent>
          <Title>Appliances</Title>
          <View>
            {props.data.scope.applianceList.map((appliance, index) =>
              <Paragraph key={index}>
              {appliance}
              </Paragraph>
            )}
          </View>
        </CardContent>
      </Card>

    );
  }
  return (
    <View>
    </View>
  );
}

/*
                 <div *ngIf="this.scope?.applianceList.length > 0">
                 <mat-card>
                     <mat-list>
                         <h3 mat-subheader >Please review your appliances:</h3>
                         <mat-list-item *ngFor="let appliance of this.scope.applianceList">
                         <mat-icon mat-list-icon>kitchen</mat-icon>
                         {{appliance}}
                     </mat-list-item>
                 </mat-list>
             </mat-card>
           */



function showObject(obj, append: string) {
  let result = "";
  for (let p in obj) {
    if( obj.hasOwnProperty(p) ) {
      result += append + ": " + p + " , " + obj[p] + "\n";
    }
  }
  console.log(result);
}

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
  containerToolbar: {
    flex: 1,
    //justifyContent: 'center',
    justifyContent: 'flex-start',
    // https://github.com/facebook/react-native/issues/2957#event-417214498
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
});
/*<Icon.ToolbarAndroid
                   title="Make Ready Details"
                   titleColor="black"
                   style={styles.toolbar}
                   navIconName="md-arrow-back"
                   onIconClicked={() => navigate('Home', { data: 'Jane' })}
               >
               </Icon.ToolbarAndroid>*/