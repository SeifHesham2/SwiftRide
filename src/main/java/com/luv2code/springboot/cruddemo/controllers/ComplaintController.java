package com.luv2code.springboot.cruddemo.controllers;

import com.luv2code.springboot.cruddemo.dto.ComplaintDTO;
import com.luv2code.springboot.cruddemo.dto.TripDTO;
import com.luv2code.springboot.cruddemo.entites.Complaint;
import com.luv2code.springboot.cruddemo.entites.ComplaintStatus;
import com.luv2code.springboot.cruddemo.entites.Trip;
import com.luv2code.springboot.cruddemo.mapper.ComplaintMapper;
import com.luv2code.springboot.cruddemo.mapper.TripMapper;
import com.luv2code.springboot.cruddemo.service.ComplaintService;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/complaints")
public class ComplaintController {
    private  final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<Complaint> complaints = complaintService.findAll();
        List<ComplaintDTO> complaintDTOs = complaints.stream()
                .map(ComplaintMapper::toDTO)
                .toList();
        return ResponseEntity.ok(complaintDTOs);
    }
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ComplaintDTO>> getComplaintsByStatus(@PathVariable ComplaintStatus status) {

        List<Complaint> complaints = complaintService.findByStatus(status);
        List<ComplaintDTO> dtos = complaints.stream()
                .map(ComplaintMapper::toDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/send/complaint")
    public ResponseEntity<?> sendComplaint(@RequestParam long customerId, @RequestParam long tripId , @RequestBody Complaint newComplaint) {
        Complaint complaint = complaintService.addComplaint(customerId,tripId,newComplaint);
        ComplaintDTO complaintDTO = ComplaintMapper.toDTO(complaint);
        return ResponseEntity.ok(complaintDTO);
    }
    @PostMapping("/open/complaint/{complaintId}")
    public ResponseEntity<?> openComplaint(@PathVariable long complaintId) {
        Complaint complaint = complaintService.openComplaint(complaintId);
        ComplaintDTO complaintDTO = ComplaintMapper.toDTO(complaint);
        return ResponseEntity.ok(complaintDTO);
    }
    @PostMapping("/closed/complaint/{complaintId}")
    public ResponseEntity<?> closeComplaint(@PathVariable long complaintId) {
        Complaint complaint = complaintService.closeComplaint(complaintId);
        ComplaintDTO complaintDTO = ComplaintMapper.toDTO(complaint);
        return ResponseEntity.ok(complaintDTO);
    }
}
