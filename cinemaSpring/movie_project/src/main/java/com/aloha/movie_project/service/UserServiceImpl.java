package com.aloha.movie_project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.movie_project.domain.UserAuth;
import com.aloha.movie_project.domain.Users;
import com.aloha.movie_project.mapper.UserMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileService fileService;
    
    @Override
    public Users select(String username) throws Exception {
        Users user = userMapper.select(username);
        return user;
    }

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public boolean login(Users user, HttpServletRequest request) throws Exception {
        // // 💍 토큰 생성
        String username = user.getUsername();    // 아이디
        String password = user.getPassword();    // 암호화되지 않은 비밀번호
        UsernamePasswordAuthenticationToken token 
            = new UsernamePasswordAuthenticationToken(username, password);
        
        // 토큰을 이용하여 인증
        Authentication authentication = authenticationManager.authenticate(token);

        // 인증 여부 확인
        boolean result = authentication.isAuthenticated();

        if( result ){
            // 시큐리티 컨텍스트에 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);

            //세션에 인증 정보 설정(세션이 없으면 새로 생성)
            HttpSession session =  request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        }
        else{
            log.error("바로 로그인 인증에 실패했습니다.");
        }
        return result;
    }

    @Override
    @Transactional // 트랜잭션 처리를 설정 (회원정보, 회원권한)
    public int join(Users user) throws Exception {
        String username = user.getUsername();
        String password = user.getPassword();
        String encodedPassword = passwordEncoder.encode(password);  // 🔒 비밀번호 암호화
        user.setPassword(encodedPassword);
        user.setEnabled(true);
        // 회원 등록
        int result = userMapper.join(user);
        // Files files = new Files();
        // files.setFkId(user.getId());
        // files.setFkTable("user");
        // files.setFile(user.getFile());
        // files.setDivision("main");
        // fileService.upload(files);

        if( result > 0 ) {
            // 회원 기본 권한 등록
            UserAuth userAuth = new UserAuth();
            userAuth.setUserId(username);
            userAuth.setAuth("ROLE_USER");
            result = userMapper.insertAuth(userAuth);
        }
        return result;
    }

    @Override
    public int update(Users user) throws Exception {
        int result = userMapper.update(user);
        return result;
    }

    @Override
    public int insertAuth(UserAuth userAuth) throws Exception {
        int result = userMapper.insertAuth(userAuth);
        return result;
    }

    @Override
    public int deleteAuth(int no) throws Exception {
        int result = userMapper.deleteAuth(no);
        return result;
    }

    @Override
    public PageInfo<Users> list(int page, int size) throws Exception {
       // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Users> list = userMapper.list();
        
        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<Users> pageInfo = new PageInfo<Users>(list, 5);
        return pageInfo;
    }

    @Override
    public PageInfo<Users> list(int page, int size, String search) throws Exception {
         // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
         PageHelper.startPage(page, size);
         List<Users> list = userMapper.search(search);
 
         // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
         PageInfo<Users> pageInfo = new PageInfo<Users>(list, 5);
         return pageInfo;
    }

    @Override
    public List<Users> list() throws Exception {
        List<Users> list = userMapper.list();
        return list;
    }

    @Override
    public int updatePw(Users user) throws Exception {
        int result = userMapper.updatePw(user);
        return result;
    }

    @Override
    public int updateEmail(Users user) throws Exception {
        int result = userMapper.updateEmail(user);
        return result;
    }
    

    
}

