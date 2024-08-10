import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Modal, TextInput, Image, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface Assignment {
  title: string;
  time: string;
  class: string;
}

const CalendarScreen = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDate, setAssignmentDate] = useState('');
  const [assignmentTime, setAssignmentTime] = useState('');
  const [className, setClassName] = useState('');
  const [assignments, setAssignments] = useState<{ [key: string]: Assignment[] | undefined }>({} as { [key: string]: Assignment[] | undefined });
  const [selectedDateAssignments, setSelectedDateAssignments] = useState<Assignment[]>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean; dotColor: string } }>({});

  const handleAddAssignment = () => {
    if (!assignmentDate || !assignmentTitle || !assignmentTime || !className) return;

    setAssignments(prevAssignments => {
      const newAssignments = {
        ...prevAssignments,
        [assignmentDate]: [
          ...(prevAssignments[assignmentDate] || []),
          { title: assignmentTitle, time: assignmentTime, class: className },
        ],
      };
      updateMarkedDates(newAssignments);
      return newAssignments;
    });

    setAssignmentTitle('');
    setAssignmentDate('');
    setAssignmentTime('');
    setClassName('');
    setIsAddModalVisible(false);
  };

  const handleDayPress = (day: DateData) => {
    const assignmentsForDay = assignments[day.dateString] || [];
    setSelectedDateAssignments(assignmentsForDay);
    setAssignmentDate(day.dateString);
    setIsViewModalVisible(true);
  };

  const handleMarkAsDone = (index: number) => {
    const updatedAssignments = selectedDateAssignments.filter((_, i) => i !== index);
    setSelectedDateAssignments(updatedAssignments);

    setAssignments(prevAssignments => {
      const newAssignments = {
        ...prevAssignments,
        [assignmentDate]: updatedAssignments,
      };
      updateMarkedDates(newAssignments);
      return newAssignments;
    });
  };

  const updateMarkedDates = (updatedAssignments: { [key: string]: Assignment[] | undefined }) => {
    const newMarkedDates: { [key: string]: { marked: boolean; dotColor: string } } = {};
    Object.keys(updatedAssignments).forEach(date => {
      newMarkedDates[date] = {
        marked: updatedAssignments[date]?.length ? true : false,
        dotColor: updatedAssignments[date]?.length ? 'red' : 'transparent',
      };
    });
    setMarkedDates(newMarkedDates);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/pandasticker.png')} 
          style={styles.sticker}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to your</Text>
          <Text style={styles.title}>Calendar</Text>
        </View>
      </View>
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructions}>
          1. Click Add New Item{'\n'}
          2. Add in your details{'\n'}
          3. Save your changes{'\n'}
          4. Click on the date on your calendar to see your assignments for the day {'\n'}
          5. To mark an assignment done, click on the date with the red mark and select the button to mark it finished
        </Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          onDayPress={handleDayPress}
          markedDates={markedDates}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add New Item</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => {
          setIsAddModalVisible(!isAddModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add Assignment</Text>
          <TextInput
            style={styles.input}
            placeholder="Class Name"
            value={className}
            onChangeText={setClassName}
          />
          <TextInput
            style={styles.input}
            placeholder="Assignment Title"
            value={assignmentTitle}
            onChangeText={setAssignmentTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Due Time (e.g., 3:00 PM)"
            value={assignmentTime}
            onChangeText={setAssignmentTime}
          />
          <Text style={styles.dateText}>Date: {assignmentDate}</Text>
          <TouchableOpacity style={styles.button} onPress={handleAddAssignment}>
            <Text style={styles.buttonText}>Add Assignment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsAddModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isViewModalVisible}
        onRequestClose={() => {
          setSelectedDateAssignments([]);
          setIsViewModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Assignments for {assignmentDate}</Text>
          {selectedDateAssignments.length ? (
            <View>
              {selectedDateAssignments.map((assignment, index) => (
                <View key={index} style={styles.assignmentContainer}>
                  <Text style={styles.assignmentText}>Class: {assignment.class}</Text>
                  <Text style={styles.assignmentText}>Title: {assignment.title}</Text>
                  <Text style={styles.assignmentText}>Time: {assignment.time}</Text>
                  <TouchableOpacity 
                    style={styles.doneButton}
                    onPress={() => handleMarkAsDone(index)}
                  >
                    <Text style={styles.doneButtonText}>Mark as Done</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text>No assignments for this day.</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={() => {
            setSelectedDateAssignments([]);
            setIsViewModalVisible(false);
          }}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#305d8f',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sticker: {
    width: 120,
    height: 120,
    marginRight: 15,
    transform: [{ rotate: '-15deg' }],
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  instructionsContainer: {
    marginTop: 0,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: 'white',
    textAlign: 'left',
    lineHeight: 24,
  },
  calendarContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  calendar: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 800, 
    alignSelf: 'center', 
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginVertical: 5,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  assignmentContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  assignmentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#28a745',
    borderRadius: 8,
    marginTop: 10,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CalendarScreen;










