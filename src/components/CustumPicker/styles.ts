import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    opacity: 1,
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 8,
  },
  pickerItemContainer: {
    paddingVertical: 4,
    width: '100%',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  itemStyle: {
    fontSize: 16,
    padding: 4,
  },
});

export default styles;