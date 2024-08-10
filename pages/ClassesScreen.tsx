import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, ScrollView } from 'react-native';

interface Semester {
  season: string;
  year: string;
  classes: Class[];
}

interface Class {
  name: string;
  startDate: string;
  endDate: string;
  days: { day: string; time: string; location: string }[];
}

const seasonalOrder = ['Fall', 'Spring', 'Spring/Summer', 'Winter'];

const getSeasonalIndex = (season: string) => seasonalOrder.indexOf(season);

const sortSemesters = (semesters: Semester[]) => {
  return semesters.sort((a, b) => {
    const yearDiff = parseInt(a.year) - parseInt(b.year);
    if (yearDiff !== 0) return yearDiff;
    return getSeasonalIndex(a.season) - getSeasonalIndex(b.season);
  });
};

const ClassesScreen = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [isSemesterFormVisible, setIsSemesterFormVisible] = useState(false);
  const [isClassFormVisible, setIsClassFormVisible] = useState(false);
  const [isViewClassesVisible, setIsViewClassesVisible] = useState(false);
  const [selectedSemesterIndex, setSelectedSemesterIndex] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [season, setSeason] = useState('Fall');
  const [year, setYear] = useState('');
  const [className, setClassName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysCount, setDaysCount] = useState<number>(1);
  const [days, setDays] = useState<{ day: string; time: string; location: string }[]>([{ day: '', time: '', location: '' }]);
  const [showAdditionalDays, setShowAdditionalDays] = useState<boolean>(false);

  const handleAddSemester = () => {
    if (year) {
      const newSemester = { season, year, classes: [] };
      setSemesters(prevSemesters => {
        const updatedSemesters = sortSemesters([...prevSemesters, newSemester]);
        const years = Array.from(new Set(updatedSemesters.map(sem => sem.year)));
        setAvailableYears(years);
        return updatedSemesters;
      });
      setSeason('Fall');
      setYear('');
      setIsSemesterFormVisible(false);
    }
  };

  const handleAddClass = () => {
    if (className && startDate && endDate && days.every(day => day.day && day.time && day.location)) {
      if (selectedSemesterIndex !== null) {
        const updatedSemesters = [...semesters];
        updatedSemesters[selectedSemesterIndex].classes.push({
          name: className,
          startDate,
          endDate,
          days
        });
        setSemesters(sortSemesters(updatedSemesters));
        setClassName('');
        setStartDate('');
        setEndDate('');
        setDays([{ day: '', time: '', location: '' }]);
        setDaysCount(1);
        setShowAdditionalDays(false);
        setIsClassFormVisible(false);
      }
    }
  };

  const handleViewClasses = (index: number) => {
    setSelectedSemesterIndex(index);
    setIsViewClassesVisible(true);
  };

  const handleDaysCountChange = (count: number) => {
    setDaysCount(count);
    const updatedDays = [...days];
    if (count > days.length) {
      for (let i = days.length; i < count; i++) {
        updatedDays.push({ day: '', time: '', location: '' });
      }
    } else {
      updatedDays.length = count;
    }
    setDays(updatedDays);
    setShowAdditionalDays(count > 2);
  };

  const renderClass = ({ item }: { item: Class }) => (
    <View style={styles.classItem}>
      <Text style={styles.className}>{item.name}</Text>
      <Text style={styles.classDetails}>{`Start: ${item.startDate} - End: ${item.endDate}`}</Text>
      {item.days.map((dayItem, index) => (
        <View key={index} style={styles.dayDetails}>
          <Text style={styles.dayText}>{`Day: ${dayItem.day}`}</Text>
          <Text style={styles.dayText}>{`Time: ${dayItem.time}`}</Text>
          <Text style={styles.dayText}>{`Location: ${dayItem.location}`}</Text>
        </View>
      ))}
    </View>
  );

  const renderSemester = ({ item, index }: { item: Semester, index: number }) => (
    <View style={styles.semesterItem}>
      <Text style={styles.semesterTitle}>{`${item.season} ${item.year}`}</Text>
      <TouchableOpacity style={styles.addClassButton} onPress={() => {
        setSelectedSemesterIndex(index);
        setIsClassFormVisible(true);
      }}>
        <Text style={styles.buttonText}>Add Class</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewClassesButton} onPress={() => handleViewClasses(index)}>
        <Text style={styles.buttonText}>View Classes</Text>
      </TouchableOpacity>
      <FlatList
        data={item.classes}
        renderItem={renderClass}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );

  const filteredSemesters = selectedYear && selectedYear !== 'All'
    ? semesters.filter(semester => semester.year === selectedYear)
    : semesters;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Classes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsSemesterFormVisible(true)}>
          <Text style={styles.buttonText}>Add New Semester</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.yearFilterContainer}>
        <TouchableOpacity
          style={[
            styles.yearFilterButton,
            selectedYear === 'All' && styles.selectedYearFilterButton
          ]}
          onPress={() => setSelectedYear('All')}
        >
          <Text style={[
            styles.yearFilterButtonText,
            selectedYear === 'All' && styles.selectedYearFilterButtonText
          ]}>All</Text>
        </TouchableOpacity>
        {availableYears.map(yearOption => (
          <TouchableOpacity
            key={yearOption}
            style={[
              styles.yearFilterButton,
              selectedYear === yearOption && styles.selectedYearFilterButton
            ]}
            onPress={() => setSelectedYear(selectedYear === yearOption ? 'All' : yearOption)}
          >
            <Text style={[
              styles.yearFilterButtonText,
              selectedYear === yearOption && styles.selectedYearFilterButtonText
            ]}>{yearOption}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={sortSemesters(filteredSemesters)}
        renderItem={renderSemester}
        keyExtractor={(item, index) => index.toString()}
      />

      <Modal
        transparent={true}
        visible={isSemesterFormVisible}
        animationType="slide"
        onRequestClose={() => setIsSemesterFormVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Semester</Text>
            <TextInput
              style={styles.input}
              placeholder="Season (e.g., Fall)"
              value={season}
              onChangeText={setSeason}
            />
            <TextInput
              style={styles.input}
              placeholder="Year"
              value={year}
              onChangeText={setYear}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddSemester}>
              <Text style={styles.buttonText}>Add Semester</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setIsSemesterFormVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isClassFormVisible}
        animationType="slide"
        onRequestClose={() => setIsClassFormVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Class</Text>
            <TextInput
              style={styles.input}
              placeholder="Class Name"
              value={className}
              onChangeText={setClassName}
            />
            <TextInput
              style={styles.input}
              placeholder="Start Date (YYYY-MM-DD)"
              value={startDate}
              onChangeText={setStartDate}
            />
            <TextInput
              style={styles.input}
              placeholder="End Date (YYYY-MM-DD)"
              value={endDate}
              onChangeText={setEndDate}
            />
            {days.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Day"
                  value={day.day}
                  onChangeText={(text) => {
                    const newDays = [...days];
                    newDays[index].day = text;
                    setDays(newDays);
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Time"
                  value={day.time}
                  onChangeText={(text) => {
                    const newDays = [...days];
                    newDays[index].time = text;
                    setDays(newDays);
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Location"
                  value={day.location}
                  onChangeText={(text) => {
                    const newDays = [...days];
                    newDays[index].location = text;
                    setDays(newDays);
                  }}
                />
              </View>
            ))}
            {showAdditionalDays && (
              <TouchableOpacity style={styles.addDayButton} onPress={() => handleDaysCountChange(daysCount + 1)}>
                <Text style={styles.buttonText}>Add More Days</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={handleAddClass}>
              <Text style={styles.buttonText}>Add Class</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setIsClassFormVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        transparent={true}
        visible={isViewClassesVisible}
        animationType="slide"
        onRequestClose={() => setIsViewClassesVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedSemesterIndex !== null && semesters[selectedSemesterIndex] && (
              <>
                <Text style={styles.modalTitle}>{`${semesters[selectedSemesterIndex].season} ${semesters[selectedSemesterIndex].year}`}</Text>
                <FlatList
                  data={semesters[selectedSemesterIndex].classes}
                  renderItem={renderClass}
                  keyExtractor={(item, index) => index.toString()}
                />
              </>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={() => setIsViewClassesVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  yearFilterContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  yearFilterButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  selectedYearFilterButton: {
    backgroundColor: '#007bff',
  },
  yearFilterButtonText: {
    color: '#007bff',
  },
  selectedYearFilterButtonText: {
    color: '#fff',
  },
  semesterItem: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  semesterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addClassButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  viewClassesButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  classItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  classDetails: {
    fontSize: 14,
    color: '#666',
  },
  dayDetails: {
    marginTop: 5,
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  dayContainer: {
    marginBottom: 10,
  },
  addDayButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default ClassesScreen;























