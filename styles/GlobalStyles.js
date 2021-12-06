import { StyleSheet,StatusBar } from "react-native";

export  const globalStyles=StyleSheet.create({
    backgroundImage: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
      },
      container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        position:"relative"
      },
      navBar: {
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft:"5%",
        paddingRight:"8%",
        justifyContent: "space-between",
        width: "100%",
        height: 70,
      },
      outerContainer:{                    
        borderRadius: 40,
        overflow: "hidden",
        marginVertical: 10,
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 4
      },     
      imageBackgroundInner:{
          flex: 1,
         justifyContent: "center",
          alignItems: "center"
      },
      innerContainer:{
        width: "100%",
        alignItems: "center",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        justifyContent: "center"
      }
})
                