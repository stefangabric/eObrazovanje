package ftn.project.eObrazovanje.web.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ftn.project.eObrazovanje.model.Exam;
import ftn.project.eObrazovanje.model.Student;
import ftn.project.eObrazovanje.model.Subject;
import ftn.project.eObrazovanje.service.StudentService;
import ftn.project.eObrazovanje.web.dto.StudentDTO;

@RestController
@RequestMapping(value = "api/students")
public class StudentController {
	@Autowired
	private StudentService studentService;

	
	@PreAuthorize("hasAnyRole('ROLE_PROFESSOR','ROLE_ADMIN')")
	@RequestMapping(value = "/all", method = RequestMethod.GET)
	public ResponseEntity<List<StudentDTO>> getAllStudents() {
		List<Student> students = studentService.findAll();
		List<StudentDTO> studentsDTO = new ArrayList<StudentDTO>();
		for (Student student : students) {
			studentsDTO.add(new StudentDTO(student));
		}
		return new ResponseEntity<>(studentsDTO, HttpStatus.OK);
	}
	
	@PreAuthorize("hasAnyRole('ROLE_PROFESSOR','ROLE_ADMIN')")
	@RequestMapping(value = "/inSubject/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<StudentDTO>> getStudentsInSubject(@PathVariable Long id) {
		List<Student> students = studentService.findAll();
		List<StudentDTO> studentsDTO = new ArrayList<StudentDTO>();
		for (Student student : students) {
			StudentDTO studentDTO=new StudentDTO(student);
			studentsDTO.add(studentDTO);
			for (Subject subject : student.getSubjects()) {
				if (subject.getId()==id) {
					for (Exam exam : student.getExams()) {
						if (exam.getPass()==true && exam.getSubject().getId()==subject.getId()) { 
							studentsDTO.remove(studentDTO);
						}
					}
				}
			}
			
		}
		return new ResponseEntity<>(studentsDTO, HttpStatus.OK);
	}
	
	@PreAuthorize("hasAnyRole('ROLE_PROFESSOR','ROLE_ADMIN')")
	@RequestMapping(method = RequestMethod.GET)
	public ResponseEntity<Page<Student>> getStudentsPage(
			@RequestParam(value = "pageNumber", required = false) int pageNumber,@RequestParam(value = "text", required = false) String text, Pageable pageable) {
		if (pageNumber < 0) {
			pageNumber = 0;
		}
		PageRequest page = null;
		try {
			page = new PageRequest(pageNumber, 20);
		} catch (Exception e) {
			page = (PageRequest) pageable;
		}
		Page<Student> students=null;
		if (text!=null) {
			students = studentService.findFilteredStudent(text, text, text, page);
		}else{
			students = studentService.findAll(page);			 
		}

		return new ResponseEntity<>(students, HttpStatus.OK);
	}
	
	@PreAuthorize("hasAnyRole('ROLE_PROFESSOR','ROLE_ADMIN','ROLE_STUDENT')")
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<StudentDTO> getStudent(@PathVariable Long id) {
		Student student = studentService.findOne(id);
		if (student == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<>(new StudentDTO(student), HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/add", method = RequestMethod.POST, consumes = "application/json")
	public ResponseEntity<StudentDTO> savestudent(@RequestBody StudentDTO student1) {
		Student student = new Student(student1.getGender(), student1.getDateOfBirth(), student1.getAddress(),
				student1.getJMBG(), student1.getPicturePath(), null, null, null, null);
		
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		String hashedPassword = passwordEncoder.encode(student1.getPassword());
		student.setName(student1.getName());
		student.setUserName(student1.getUserName());
		student.setRole("STUDENT");
		student.setLastName(student1.getLastName());
		student.setPassword(hashedPassword);
		student.setPicturePath(student1.getPicturePath());
		student = studentService.save(student);

		return new ResponseEntity<>(new StudentDTO(student), HttpStatus.CREATED);
	}

	
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STUDENT')")
	@RequestMapping(value = "/edit/{id}", method = RequestMethod.PUT, consumes = "application/json")
	public ResponseEntity<StudentDTO> updatestudent(@RequestBody StudentDTO student1) {
		// a student must exist
		Student student = studentService.findOne(student1.getId());
		if (student == null) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		student.setAddress(student1.getAddress());
		student.setDateOfBirth(student1.getDateOfBirth());
		student.setGender(student1.getGender());
		student.setJMBG(student1.getJMBG());
		student.setLastName(student1.getLastName());
		student.setName(student1.getName());
		student.setPicturePath(student1.getPicturePath());
		student.setUserName(student1.getUserName());
		student.setRole(student1.getRole());
		student = studentService.save(student);

		return new ResponseEntity<>(new StudentDTO(student), HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
		Student student = studentService.findOne(id);
		if (student != null) {
			studentService.remove(id);
			return new ResponseEntity<>(HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	
	
	
	@PreAuthorize("hasAnyRole('ROLE_PROFESSOR','ROLE_ADMIN')")
	@RequestMapping(value = "/getStudentsInSubject/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<StudentDTO>> getStudentsNotInSubject(@PathVariable Long id) {
		List<StudentDTO> studentsDTO = new ArrayList<StudentDTO>();
		List<Student> students = studentService.findAll();
		//Subject subject = subjectService.findOne(id);
		for (Student student : students) {	
				for (Subject subject : student.getSubjects()) {
					if (subject.getId() == id) {
						studentsDTO.add(new StudentDTO(student));
					} 
				}
		}
 
		return new ResponseEntity<>(studentsDTO, HttpStatus.OK);

	}
}