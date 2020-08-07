import React, { useState, useEffect, useRef, useMemo } from 'react';

import { View, ScrollView, Text, TextInput, Keyboard, Platform, Modal } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';


import api from '../../services/api';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import CustumPicker from '../../components/CustumPicker';


import styles from './styles';

interface WeekDayTypes {
  value: number;
  label: string;
}
interface SubjectTypes {
  value: string;
  label: string;
}

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState(new Date('Mon, 01 Dec 1900 23:00:00 -0300'));
  const [show, setShow] = useState(false);

  const weekDaysArray: WeekDayTypes[] = [
    {value: 0, label: 'Domingo'},
    {value: 1, label: 'Segunda-feira'},
    {value: 2, label: 'Terça-feira'},
    {value: 3, label: 'Quarta-feira'},
    {value: 4, label: 'Quinta-feira'},
    {value: 5, label: 'Sexta-feira'},
    {value: 6, label: 'Sábado'}
  ];
  const subjectArray: SubjectTypes[] = [
    {value: 'Artes', label: 'Artes'},
    {value: 'Biologia', label: 'Biologia'},
    {value: 'Ciências', label: 'Ciências'},
    {value: 'Educação Física', label: 'Educação Física'},
    {value: 'Física', label: 'Física'},
    {value: 'Geografia', label: 'Geografia'},
    {value: 'História', label: 'História'},
    {value: 'Português', label: 'Português'},
    {value: 'Química', label: 'Química'}
  ];

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
          return teacher.id;
        });

        setFavorites(favoritedTeachersIds);
      }
    });
  }
  
  
  useEffect(() => {loadFavorites();}, []);


  function handleToggleFiltersVisible() {
    setIsFiltersVisible(!isFiltersVisible);
  }

  async function handleFiltersSubmit() {
    loadFavorites();

    const timeFormat = String(("0" + time.getHours()).slice(-2))+String(':')+String(("0" + time.getMinutes()).slice(-2));

    const response = await api.get('classes', {
      params: {
        subject, week_day, time:timeFormat,
      },
    });

    setIsFiltersVisible(false);
    setTeachers(response.data);
  }
  /*const onChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || time;
    setTime(currentDate);
    setShow(false);
  };*/
  const onChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || time;
    //setShow(Platform.OS === 'ios');
    setTime(currentDate);
  };



  function showClock(){
    Keyboard.dismiss();
    setShow(true);
    
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponíveis"
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color={isFiltersVisible ? "#04d361" : "#fff"  } />
          </BorderlessButton>
        )}
      >
        { isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <View style={styles.pickerView}>
                    <CustumPicker
                      onChange={setSubject} 
                      pickerValues={subjectArray} 
                      title="Selecione uma matéria" 
                      placeholder="Selecione uma matéria" 
                    />
                </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <View style={styles.pickerView}>
                  <CustumPicker
                    onChange={setWeekDay} 
                    pickerValues={weekDaysArray} 
                    title="Selecione um dia da semana" 
                    placeholder="Selecione um dia da semana" 
                  />
                </View>
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                
                {show && (
                <Modal visible={show} animationType="slide" transparent>
                  <View style={styles.containerModal}>
                  <View style={styles.datePickerItemsContainer}>
                    <DateTimePicker
                            value={time}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                          
                            />
                            </View>
                            </View>
                  </Modal>)}
                
                 <TextInput
                  style={styles.input}
                  value={String(("0" + time.getHours()).slice(-2))+String(':')+String(("0" + time.getMinutes()).slice(-2))}
                  onBlur={() => Keyboard.dismiss()}
                  onFocus={() => Keyboard.dismiss()}
                  onTouchStart={showClock}
                  onTouchEnd={() => setShow(false)}
                  /*onChangeText={text => setTime(text)}*/
                  placeholder="Qual horário?"
                  placeholderTextColor="#c1bccc"
                />
              </View>
            </View>

            <RectButton
              style={styles.submitButton}
              onPress={handleFiltersSubmit}
            >
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

export default TeacherList;